export function annaChatConfigured() {
  return process.env.NODE_ENV === "development"
    && process.env.ANNA_DEV_CHAT_ENABLED === "true"
    && Boolean(process.env.ANNA_XAI_API_KEY?.trim())
    && Boolean(process.env.ANNA_MODEL?.trim());
}
