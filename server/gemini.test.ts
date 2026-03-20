import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";

// Mock the db functions
vi.mock("./db", () => ({
  getCrmLeadById: vi.fn(),
  getCrmLeads: vi.fn(),
  getCrmLocations: vi.fn(),
  getCrmStats: vi.fn(),
  updateCrmLeadStatus: vi.fn(),
}));

describe("CRM Gemini Email Rewrite", () => {
  it("should rewrite email with professional tone", async () => {
    const mockLead = {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      companyName: "Acme Corp",
      jobTitle: "Owner",
      location: "New York",
      website: "acme.com",
      linkedin: null,
      status: "new" as const,
      subject1: "Transform Your Med Spa",
      body1: "Hi John, we help med spas automate their operations.",
      subject2: null,
      body2: null,
      subject3: null,
      body3: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.getCrmLeadById).mockResolvedValue(mockLead);

    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.crm.rewriteEmail({
      leadId: 1,
      step: "1",
      tone: "professional",
    });

    expect(result).toHaveProperty("subject");
    expect(result).toHaveProperty("body");
    expect(result).toHaveProperty("originalSubject");
    expect(result).toHaveProperty("originalBody");
    expect(result.originalSubject).toBe("Transform Your Med Spa");
    expect(result.originalBody).toContain("Hi John");
  });

  it("should throw error if lead not found", async () => {
    vi.mocked(db.getCrmLeadById).mockResolvedValue(null);

    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    await expect(
      caller.crm.rewriteEmail({
        leadId: 999,
        step: "1",
        tone: "professional",
      })
    ).rejects.toThrow("Lead not found");
  });

  it("should throw error if email step not available", async () => {
    const mockLead = {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      companyName: "Acme Corp",
      jobTitle: "Owner",
      location: "New York",
      website: "acme.com",
      linkedin: null,
      status: "new" as const,
      subject1: null,
      body1: null,
      subject2: null,
      body2: null,
      subject3: null,
      body3: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.getCrmLeadById).mockResolvedValue(mockLead);

    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    await expect(
      caller.crm.rewriteEmail({
        leadId: 1,
        step: "1",
        tone: "professional",
      })
    ).rejects.toThrow("Email step 1 not available for this lead");
  });

  it("should send email with custom subject/body from rewrite", async () => {
    const mockLead = {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      companyName: "Acme Corp",
      jobTitle: "Owner",
      location: "New York",
      website: "acme.com",
      linkedin: null,
      status: "new" as const,
      subject1: "Original Subject",
      body1: "Original body",
      subject2: null,
      body2: null,
      subject3: null,
      body3: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.getCrmLeadById).mockResolvedValue(mockLead);
    vi.mocked(db.updateCrmLeadStatus).mockResolvedValue(undefined);

    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    // Mock fetch for AgentMail
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "thread-123" }),
    });

    const result = await caller.crm.sendEmail({
      leadId: 1,
      step: "1",
      customSubject: "Personalized Subject",
      customBody: "Personalized body",
    });

    expect(result).toEqual({ success: true, threadId: "thread-123" });
    expect(vi.mocked(db.updateCrmLeadStatus)).toHaveBeenCalledWith(1, "step1_sent");
  });
});
