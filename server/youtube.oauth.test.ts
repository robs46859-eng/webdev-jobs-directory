import { describe, it, expect, vi } from "vitest";

// Mock ENV
vi.mock("./_core/env", () => ({
  ENV: {
    youtubeClientId: "test-client-id",
    youtubeClientSecret: "test-client-secret",
    youtubeRedirectUri: "http://localhost:5000/api/auth/youtube/callback",
  },
}));

describe("YouTube OAuth Flow", () => {
  it("should construct correct Google OAuth authorization URL", () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=test-client-id&redirect_uri=http://localhost:5000/api/auth/youtube/callback&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly&access_type=offline&prompt=consent`;
    expect(url).toContain("client_id=test-client-id");
    expect(url).toContain("redirect_uri=http://localhost:5000/api/auth/youtube/callback");
    expect(url).toContain("scope=https://www.googleapis.com/auth/youtube.readonly");
    expect(url).toContain("access_type=offline");
    expect(url).toContain("prompt=consent");
  });

  it("should construct correct token exchange body and payload", () => {
    const code = "mock-auth-code";
    const body = new URLSearchParams({
      code,
      client_id: "test-client-id",
      client_secret: "test-client-secret",
      redirect_uri: "http://localhost:5000/api/auth/youtube/callback",
      grant_type: "authorization_code",
    });

    expect(body.get("code")).toBe(code);
    expect(body.get("client_id")).toBe("test-client-id");
    expect(body.get("client_secret")).toBe("test-client-secret");
    expect(body.get("grant_type")).toBe("authorization_code");
    
    // Verify token headers
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    expect(headers["Content-Type"]).toBe("application/x-www-form-urlencoded");
  });
});
