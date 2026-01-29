import { describe, it, expect } from "vitest";
import request from "supertest";

describe("POST /ai", () => {
  it("returns generated text", async () => {
    process.env.GOOGLE_API_KEY = "fake-key";

    // On injecte un faux createClient
    const { makeApp } = await import("./index.js");
    const app = makeApp({
      createClient: () => ({
        models: {
          generateContent: async () => ({ text: "MOCK_OK" }),
        },
      }),
    });

    const res = await request(app)
      .post("/ai")
      .send({ prompt: "Dis bonjour" })
      .set("Content-Type", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.text).toBe("MOCK_OK");
  });
});
