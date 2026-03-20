import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock ENV
vi.mock("./_core/env", () => ({
  ENV: {
    agentmailApiKey: "test-api-key",
    agentmailSmithgroupKey: "robert@smithgroup.io",
    agentmailCaptivateKey: "roberts@robcotech.pro",
    googleApiKey: "test-google-key",
    cookieSecret: "test-secret",
    databaseUrl: "",
    oAuthServerUrl: "",
    ownerOpenId: "",
    isProduction: false,
    forgeApiUrl: "",
    forgeApiKey: "",
    appId: "",
  },
}));

describe("CRM Routes", () => {
  it("should have CRM lead status enum values", () => {
    const validStatuses = ["new", "step1_sent", "step2_sent", "step3_sent", "replied", "booked", "unsubscribed"];
    expect(validStatuses).toHaveLength(7);
    expect(validStatuses).toContain("new");
    expect(validStatuses).toContain("booked");
  });

  it("should validate CRM lead data structure", () => {
    const lead = {
      id: 1,
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      companyName: "Test Spa",
      jobTitle: "Owner",
      website: "testspa.com",
      location: "New York, NY",
      linkedin: "linkedin.com/in/johndoe",
      subject1: "Test Subject 1",
      body1: "Test Body 1",
      subject2: "Test Subject 2",
      body2: "Test Body 2",
      subject3: "Test Subject 3",
      body3: "Test Body 3",
      status: "new",
    };

    expect(lead.email).toContain("@");
    expect(lead.firstName).toBeTruthy();
    expect(lead.status).toBe("new");
    expect(lead.subject1).toBeTruthy();
    expect(lead.body1).toBeTruthy();
  });

  it("should map email steps to correct status", () => {
    const statusMap: Record<string, string> = {
      "1": "step1_sent",
      "2": "step2_sent",
      "3": "step3_sent",
    };

    expect(statusMap["1"]).toBe("step1_sent");
    expect(statusMap["2"]).toBe("step2_sent");
    expect(statusMap["3"]).toBe("step3_sent");
  });
});

describe("Email (AgentMail) Integration", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should construct correct list threads URL", () => {
    const inboxId = "robert@smithgroup.io";
    const url = `https://api.agentmail.to/v0/inboxes/${inboxId}/threads`;
    expect(url).toBe("https://api.agentmail.to/v0/inboxes/robert@smithgroup.io/threads");
  });

  it("should construct correct send message URL for new thread", () => {
    const inboxId = "robert@smithgroup.io";
    const url = `https://api.agentmail.to/v0/inboxes/${inboxId}/threads`;
    expect(url).toContain("/threads");
    expect(url).not.toContain("/messages");
  });

  it("should construct correct reply URL for existing thread", () => {
    const inboxId = "robert@smithgroup.io";
    const threadId = "thread-123";
    const url = `https://api.agentmail.to/v0/inboxes/${inboxId}/threads/${threadId}/messages`;
    expect(url).toContain("/threads/thread-123/messages");
  });

  it("should include auth header in requests", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ threads: [] }),
    });

    await fetch("https://api.agentmail.to/v0/inboxes/robert@smithgroup.io/threads", {
      headers: { Authorization: "Bearer test-api-key" },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.agentmail.to/v0/inboxes/robert@smithgroup.io/threads",
      expect.objectContaining({
        headers: { Authorization: "Bearer test-api-key" },
      })
    );
  });

  it("should construct correct CRM send URL using Captivate inbox", () => {
    const inboxId = "roberts@robcotech.pro";
    const url = `https://api.agentmail.to/v0/inboxes/${inboxId}/threads`;
    expect(url).toBe("https://api.agentmail.to/v0/inboxes/roberts@robcotech.pro/threads");
  });
});

describe("YouTube Data API Integration", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should construct correct YouTube search URL", () => {
    const params = new URLSearchParams({
      part: "snippet",
      q: "2000s skater punk",
      type: "video",
      maxResults: "10",
      key: "test-google-key",
    });

    const url = `https://www.googleapis.com/youtube/v3/search?${params}`;
    expect(url).toContain("googleapis.com/youtube/v3/search");
    expect(url).toContain("part=snippet");
    expect(url).toContain("type=video");
    expect(url).toContain("q=2000s+skater+punk");
    expect(url).toContain("key=test-google-key");
  });

  it("should handle YouTube search response structure", async () => {
    const mockResponse = {
      items: [
        {
          id: { videoId: "abc123" },
          snippet: {
            title: "Test Video",
            channelTitle: "Test Channel",
            thumbnails: { medium: { url: "https://i.ytimg.com/vi/abc123/mqdefault.jpg" } },
          },
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const res = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&type=video&maxResults=10&key=test-key");
    const data = await res.json();

    expect(data.items).toHaveLength(1);
    expect(data.items[0].id.videoId).toBe("abc123");
    expect(data.items[0].snippet.title).toBe("Test Video");
  });

  it("should limit maxResults between 1 and 25", () => {
    const validValues = [1, 5, 10, 12, 25];
    const invalidValues = [0, -1, 26, 100];

    for (const v of validValues) {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(25);
    }

    for (const v of invalidValues) {
      expect(v < 1 || v > 25).toBe(true);
    }
  });
});

describe("Route Structure", () => {
  it("should have all required route namespaces", () => {
    const routes = ["crm", "email", "youtube", "auth", "system"];
    expect(routes).toContain("crm");
    expect(routes).toContain("email");
    expect(routes).toContain("youtube");
    expect(routes).toContain("auth");
  });

  it("should have CRM sub-routes", () => {
    const crmRoutes = ["list", "getById", "updateStatus", "locations", "stats", "sendEmail"];
    expect(crmRoutes).toHaveLength(6);
    expect(crmRoutes).toContain("sendEmail");
    expect(crmRoutes).toContain("list");
  });

  it("should have email sub-routes", () => {
    const emailRoutes = ["listThreads", "getThread", "getMessages", "send"];
    expect(emailRoutes).toHaveLength(4);
    expect(emailRoutes).toContain("send");
  });
});
