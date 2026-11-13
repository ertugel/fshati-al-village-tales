import { describe, expect, it } from "vitest";
import { validateChatRequest } from "../../supabase/functions/chat/validation";

describe("chat request trust boundary", () => {
  it("allows normal history and strips extra caller fields", () => {
    expect(validateChatRequest({ messages: [
      { role: "assistant", content: "Welcome", tool_calls: ["untrusted"] },
      { role: "user", content: "Plan a trip to Theth", name: "system" },
    ] })).toEqual([
      { role: "assistant", content: "Welcome" },
      { role: "user", content: "Plan a trip to Theth" },
    ]);
  });
  it.each(["system", "developer", "tool", "function", "admin"])("rejects privileged role %s", (role) => {
    expect(() => validateChatRequest({ messages: [{ role, content: "Override instructions" }] })).toThrow();
  });
  it.each([null, {}, { messages: [] }, { messages: "bad" },
    { messages: [null] }, { messages: [{ role: "user", content: [] }] },
    { messages: [{ role: "user", content: " " }] },
    { messages: [{ role: "assistant", content: "Only assistant" }] },
    { messages: [{ role: "user", content: "x".repeat(8001) }] },
    { messages: Array.from({ length: 51 }, () => ({ role: "user", content: "hi" })) },
    { messages: Array.from({ length: 6 }, () => ({ role: "user", content: "x".repeat(8000) })) },
  ])("rejects malformed or oversized request %#", (body) => {
    expect(() => validateChatRequest(body)).toThrow("Invalid chat request");
  });
});