import { ANNA_MAX_BYTES, ANNA_MAX_MESSAGES, ANNA_MAX_TEXT } from "./config";

export type AnnaMessage = { role: "user" | "assistant"; content: string };

export function parseAnnaMessages(body: unknown): AnnaMessage[] | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const record = body as Record<string, unknown>;
  if (Object.keys(record).length !== 1 || !Array.isArray(record.messages)) return null;
  if (!record.messages.length || record.messages.length > ANNA_MAX_MESSAGES || record.messages.length % 2 !== 1) return null;
  const messages: AnnaMessage[] = [];
  for (const [index, value] of record.messages.entries()) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const item = value as Record<string, unknown>;
    if (Object.keys(item).length !== 2 || !("role" in item) || !("content" in item)) return null;
    const role = index % 2 === 0 ? "user" : "assistant";
    if (item.role !== role) return null;
    if (typeof item.content !== "string" || !item.content.trim() || item.content.length > ANNA_MAX_TEXT) return null;
    messages.push({ role, content: item.content.trim() });
  }
  return messages;
}

export async function readAnnaBody(request: Request): Promise<unknown> {
  if (!request.body) throw new Error("invalid");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > ANNA_MAX_BYTES) {
        await reader.cancel();
        throw new Error("too-large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
