import { describe, it, expect } from "vitest";

// Validate that the AgentMail API key works by listing inboxes
describe("AgentMail API Key", () => {
  it("should authenticate and list inboxes", async () => {
    const key = process.env.AGENTMAIL_API_KEY;
    expect(key).toBeTruthy();

    const res = await fetch("https://api.agentmail.to/v0/inboxes", {
      headers: { Authorization: `Bearer ${key}` },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toBeDefined();
    console.log("Inboxes found:", JSON.stringify(data, null, 2));
  });

  it("should access Smithgroup inbox", async () => {
    const key = process.env.AGENTMAIL_API_KEY;
    const inboxId = process.env.AGENTMAIL_SMITHGROUP_KEY;
    expect(key).toBeTruthy();
    expect(inboxId).toBeTruthy();

    const res = await fetch(`https://api.agentmail.to/v0/inboxes/${inboxId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    console.log("Smithgroup inbox:", JSON.stringify(data, null, 2));
  });

  it("should access Captivate inbox", async () => {
    const key = process.env.AGENTMAIL_API_KEY;
    const inboxId = process.env.AGENTMAIL_CAPTIVATE_KEY;
    expect(key).toBeTruthy();
    expect(inboxId).toBeTruthy();

    const res = await fetch(`https://api.agentmail.to/v0/inboxes/${inboxId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    console.log("Captivate inbox:", JSON.stringify(data, null, 2));
  });
});

// Validate Google API key works with YouTube Data API
describe("Google API Key", () => {
  it("should authenticate with YouTube Data API", async () => {
    const key = process.env.GOOGLE_API_KEY;
    expect(key).toBeTruthy();

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&maxResults=1&type=video&key=${key}`
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.items).toBeDefined();
  });
});
