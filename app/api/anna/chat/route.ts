import { generateText } from "ai";
import { createXai } from "@ai-sdk/xai";
import { ANNA_MAX_TEXT } from "../../../../lib/anna/config";
import { annaChatConfigured } from "../../../../lib/anna/access.server";
import { annaInstructions } from "../../../../lib/anna/persona";
import { parseAnnaMessages, readAnnaBody } from "../../../../lib/anna/request";

export const runtime = "nodejs";
export const maxDuration = 30;

// Process-local limits are sufficient only for the local development gate below.
let windowStart = 0;
let requests = 0;
let active = 0;
const headers = { "Cache-Control": "no-store" };
function error(message: string, status: number) {
  return Response.json({ error: message }, { status, headers });
}

export async function POST(request: Request) {
  // Always fail closed in production, even if development flags are copied there.
  if (!annaChatConfigured()) return error("Anna chat is not available yet.", 503);
  if (request.headers.get("origin") !== new URL(request.url).origin) return error("Request not allowed.", 403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return error("JSON is required.", 415);
  const now = Date.now();
  if (now - windowStart >= 60000) { windowStart = now; requests = 0; }
  if (requests >= 10 || active >= 2) {
    return Response.json({ error: "Please wait a moment before trying again." }, { status: 429, headers: { ...headers, "Retry-After": "60" } });
  }
  requests++;
  active++;
  try {
    let body: unknown;
    try { body = await readAnnaBody(request); }
    catch (cause) { return error("Invalid or oversized request.", cause instanceof Error && cause.message === "too-large" ? 413 : 400); }
    const messages = parseAnnaMessages(body);
    if (!messages) return error("Invalid conversation. Start a new chat and try again.", 400);
    const provider = createXai({ apiKey: process.env.ANNA_XAI_API_KEY! });
    const result = await generateText({
      model: provider.responses(process.env.ANNA_MODEL!.trim()),
      instructions: annaInstructions,
      messages,
      allowSystemInMessages: false,
      maxOutputTokens: 400,
      maxRetries: 0,
      abortSignal: AbortSignal.any([request.signal, AbortSignal.timeout(20000)]),
    });
    const reply = result.text.trim();
    if (!reply) return error("Anna could not finish that response. Please try again.", 502);
    // Keep responses compatible with the bounded history contract.
    return Response.json({ reply: reply.slice(0, ANNA_MAX_TEXT) }, { headers });
  } catch {
    // Never log conversation content, prompts, provider errors or credentials.
    return error("Anna could not respond. Your message has not been added to the conversation; you can retry.", 502);
  } finally { active--; }
}
