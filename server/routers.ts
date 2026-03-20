import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,

  // Manus OAuth auth (kept for compatibility)
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── CRM Routes ──
  crm: router({
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        status: z.string().optional(),
        location: z.string().optional(),
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getCrmLeads({
          search: input?.search,
          status: input?.status,
          location: input?.location,
          limit: input?.limit,
          offset: input?.offset,
        });
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getCrmLeadById(input.id);
      }),

    updateStatus: publicProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "step1_sent", "step2_sent", "step3_sent", "replied", "booked", "unsubscribed"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateCrmLeadStatus(input.id, input.status, input.notes);
        return { success: true };
      }),

    locations: publicProcedure.query(async () => {
      return db.getCrmLocations();
    }),

    stats: publicProcedure.query(async () => {
      return db.getCrmStats();
    }),

    rewriteEmail: publicProcedure
      .input(z.object({
        leadId: z.number(),
        step: z.enum(["1", "2", "3"]),
        tone: z.enum(["professional", "friendly", "urgent", "casual"]).optional(),
        customInstructions: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const lead = await db.getCrmLeadById(input.leadId);
        if (!lead) throw new Error("Lead not found");

        const subjectKey = `subject${input.step}` as keyof typeof lead;
        const bodyKey = `body${input.step}` as keyof typeof lead;
        const originalSubject = lead[subjectKey] as string;
        const originalBody = lead[bodyKey] as string;

        if (!originalSubject || !originalBody) {
          throw new Error(`Email step ${input.step} not available for this lead`);
        }

        const tone = input.tone || "professional";
        const customNote = input.customInstructions ? `\nAdditional instructions: ${input.customInstructions}` : "";

        const systemPrompt = `You are an expert cold email copywriter for Captivate, a med spa automation software company. Your job is to personalize outbound sales emails to make them feel hand-written and relevant to each prospect.

Rules:
- Keep the email concise (under 150 words for the body)
- Naturally weave in the prospect's name, company, and location
- Maintain the core value proposition from the original email
- Use a ${tone} tone
- Do NOT mention competitors by name
- Position Captivate as a value statement for the customer
- Make the call-to-action clear and low-friction
- Return valid JSON with "subject" and "body" fields only
- The body should be plain text (no HTML), using \n for line breaks${customNote}`;

        const userPrompt = `Personalize this email for the following prospect:

Prospect Info:
- Name: ${lead.firstName} ${lead.lastName}
- Company: ${lead.companyName}
- Title: ${lead.jobTitle || "Owner"}
- Location: ${lead.location || "Unknown"}
- Website: ${lead.website || "N/A"}

Original Subject: ${originalSubject}

Original Body:
${originalBody}

Return a JSON object with "subject" and "body" keys containing the personalized email.`;

        const result = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "personalized_email",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  subject: { type: "string", description: "Personalized email subject line" },
                  body: { type: "string", description: "Personalized email body text" },
                },
                required: ["subject", "body"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = result.choices?.[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error("LLM returned no content");
        }

        const parsed = JSON.parse(content);
        return {
          subject: parsed.subject as string,
          body: parsed.body as string,
          originalSubject,
          originalBody,
        };
      }),

    sendEmail: publicProcedure
      .input(z.object({
        leadId: z.number(),
        step: z.enum(["1", "2", "3"]),
        customSubject: z.string().optional(),
        customBody: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const lead = await db.getCrmLeadById(input.leadId);
        if (!lead) throw new Error("Lead not found");

        // Use custom (AI-rewritten) content if provided, otherwise use original
        const subjectKey = `subject${input.step}` as keyof typeof lead;
        const bodyKey = `body${input.step}` as keyof typeof lead;
        const subject = input.customSubject || (lead[subjectKey] as string);
        const body = input.customBody || (lead[bodyKey] as string);

        if (!subject || !body) throw new Error(`Email step ${input.step} not available for this lead`);

        // Send via AgentMail using Captivate inbox
        const res = await fetch(`https://api.agentmail.to/v1/inboxes/${ENV.agentmailCaptivateKey}/threads`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ENV.agentmailApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: lead.email,
            subject,
            body,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`AgentMail send failed: ${res.status}`, errText);
          throw new Error(`AgentMail send failed: ${res.status}`);
        }

        const responseData = await res.json();

        // Update lead status
        const statusMap: Record<string, string> = {
          "1": "step1_sent",
          "2": "step2_sent",
          "3": "step3_sent",
        };
        await db.updateCrmLeadStatus(input.leadId, statusMap[input.step]);

        return { success: true, threadId: responseData?.id };
      }),
  }),

  // ── Email (Smithgroup Inbox) ──
  email: router({
    listThreads: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).optional(),
        cursor: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const params = new URLSearchParams();
        if (input?.limit) params.set("limit", String(input.limit));
        if (input?.cursor) params.set("cursor", input.cursor);

        const res = await fetch(
          `https://api.agentmail.to/v0/inboxes/${ENV.agentmailSmithgroupKey}/threads?${params}`,
          { headers: { Authorization: `Bearer ${ENV.agentmailApiKey}` } }
        );
        if (!res.ok) throw new Error(`Failed to list threads: ${res.status}`);
        return res.json();
      }),

    getThread: publicProcedure
      .input(z.object({ threadId: z.string() }))
      .query(async ({ input }) => {
        const res = await fetch(
          `https://api.agentmail.to/v0/inboxes/${ENV.agentmailSmithgroupKey}/threads/${input.threadId}`,
          { headers: { Authorization: `Bearer ${ENV.agentmailApiKey}` } }
        );
        if (!res.ok) throw new Error(`Failed to get thread: ${res.status}`);
        return res.json();
      }),

    getMessages: publicProcedure
      .input(z.object({ threadId: z.string() }))
      .query(async ({ input }) => {
        const res = await fetch(
          `https://api.agentmail.to/v0/inboxes/${ENV.agentmailSmithgroupKey}/threads/${input.threadId}/messages`,
          { headers: { Authorization: `Bearer ${ENV.agentmailApiKey}` } }
        );
        if (!res.ok) throw new Error(`Failed to get messages: ${res.status}`);
        return res.json();
      }),

    send: publicProcedure
      .input(z.object({
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
        threadId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const url = input.threadId
          ? `https://api.agentmail.to/v0/inboxes/${ENV.agentmailSmithgroupKey}/threads/${input.threadId}/messages`
          : `https://api.agentmail.to/v0/inboxes/${ENV.agentmailSmithgroupKey}/threads`;

        const payload = input.threadId
          ? { body: input.body }
          : {
              to: [{ email: input.to }],
              subject: input.subject,
              body: input.body,
            };

        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ENV.agentmailApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Send failed: ${res.status} ${errText}`);
        }
        return res.json();
      }),
  }),

  // ── YouTube Search ──
  youtube: router({
    status: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return { authenticated: false };
      const cred = await db.getYoutubeCredentialByUserId(ctx.user.id);
      return { authenticated: !!cred };
    }),

    search: publicProcedure
      .input(z.object({
        query: z.string().min(1),
        maxResults: z.number().min(1).max(25).optional(),
      }))
      .query(async ({ ctx, input }) => {
        const params = new URLSearchParams({
          part: "snippet",
          q: input.query,
          type: "video",
          maxResults: String(input.maxResults || 10),
        });

        let headers: Record<string, string> = {};

        if (ctx.user) {
          const cred = await db.getYoutubeCredentialByUserId(ctx.user.id);
          if (cred?.accessToken) {
             // Use user's OAuth token
            headers["Authorization"] = `Bearer ${cred.accessToken}`;
          } else {
             // Fallback
            params.set("key", ENV.googleApiKey);
          }
        } else {
          // Fallback
          params.set("key", ENV.googleApiKey);
        }

        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, { headers });
        if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
        return res.json();
      }),
  }),
});

export type AppRouter = typeof appRouter;
