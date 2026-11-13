export type ChatMessage = { role: "user" | "assistant"; content: string };

// Never accept caller-supplied system/developer/tool roles or extra message fields.
export function validateChatRequest(body: unknown): ChatMessage[] {
  if (!body || typeof body !== "object" || !('messages' in body)) {
    throw new Error("Invalid chat request");
  }
  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 50) {
    throw new Error("Invalid chat request");
  }
  let totalLength = 0;
  const validated = messages.map((message: unknown): ChatMessage => {
    if (!message || typeof message !== "object" ||
        !('role' in message) || !('content' in message) ||
        (message.role !== "user" && message.role !== "assistant") ||
        typeof message.content !== "string" ||
        !message.content.trim() || message.content.length > 8000) {
      throw new Error("Invalid chat request");
    }
    totalLength += message.content.length;
    return { role: message.role, content: message.content };
  });
  if (totalLength > 40000 || validated[validated.length - 1].role !== "user") {
    throw new Error("Invalid chat request");
  }
  return validated;
}