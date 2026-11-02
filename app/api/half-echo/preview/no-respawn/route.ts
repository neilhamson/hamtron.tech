import { readFile } from "node:fs/promises";
import { halfEchoPreviewAvailable, halfEchoPreviewPath } from "../../../../../lib/halfEchoPreview.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!halfEchoPreviewAvailable()) return Response.json({ error: "Audio preview is not available." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  try {
    const audio = await readFile(halfEchoPreviewPath);
    return new Response(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.length),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return Response.json({ error: "Audio preview could not be loaded." }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
}
