import { existsSync } from "node:fs";
import path from "node:path";

// A fixed local file, never a path supplied by a browser or conversation.
export const halfEchoPreviewPath = path.join(process.cwd(), ".local-media", "No_Respawn_Web.mp3");
export function halfEchoPreviewAvailable() {
  return process.env.NODE_ENV === "development"
    && process.env.HALF_ECHO_LOCAL_PREVIEW === "true"
    && existsSync(halfEchoPreviewPath);
}
