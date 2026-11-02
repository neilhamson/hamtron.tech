"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ANNA_MAX_BYTES, ANNA_MAX_MESSAGES, ANNA_MAX_TEXT } from "../../lib/anna/config";
import type { AnnaMessage } from "../../lib/anna/request";
import styles from "../half-echo/echo.module.css";

const starters = ["What kind of music is Half Echo?", "Let's talk about a creative idea.", "I'd like to talk something through."];

export default function AnnaChat({ available }: { available: boolean }) {
  const [messages, setMessages] = useState<AnnaMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => () => pending.current?.abort(), []);
  useEffect(() => { if (messages.length) end.current?.scrollIntoView({ block: "nearest" }); }, [messages]);
  const atLimit = messages.length >= ANNA_MAX_MESSAGES - 1;

  function clear() {
    pending.current?.abort(); pending.current = null;
    setMessages([]); setInput(""); setError(""); setBusy(false);
    inputRef.current?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!available || pending.current || atLimit || !content) return;
    const next: AnnaMessage[] = [...messages, { role: "user", content }];
    const body = JSON.stringify({ messages: next });
    if (new TextEncoder().encode(body).byteLength > ANNA_MAX_BYTES) {
      setError("This conversation is full. Start a new chat to continue."); return;
    }
    const controller = new AbortController(); pending.current = controller;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/anna/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body, signal: controller.signal });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Anna could not respond.");
      if (typeof result.reply !== "string" || !result.reply.trim()) throw new Error("Anna could not finish that response.");
      if (pending.current !== controller) return;
      setMessages([...next, { role: "assistant", content: result.reply }]); setInput("");
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Connection lost. Please try again.");
    } finally {
      if (pending.current === controller) { pending.current = null; setBusy(false); }
    }
  }

  return <section className={styles.section} id="anna-chat" aria-labelledby="anna-chat-title">
    <p className={styles.kicker}>Anna / AI companion</p>
    <h2 className={styles.heading} id="anna-chat-title">A little conversation.</h2>
    {!available ? <div className={styles.card}><h3>Chat is taking shape.</h3><p>Anna is in development. Her public chat is not available yet. In the meantime, explore the music that gives her world its character.</p><a href="https://www.youtube.com/@HalfechoYT" target="_blank" rel="noopener noreferrer">Explore Half Echo on YouTube ↗</a></div> : <div className={styles.chat}>
      <p className={styles.chatNote}>Development preview · AI responses can be mistaken. This chat stays in this tab’s memory and is sent to the AI provider when you submit. No permanent memory is implemented. New chat clears the conversation here; it does not delete provider records.</p>
      <div className={styles.chatMessages} role="log" aria-label="Conversation with Anna" aria-live="polite" aria-relevant="additions" aria-busy={busy}>
        {!messages.length && <p className={styles.chatWelcome}>Hi, I’m Anna, an AI companion from HAMTRON. We can talk music, ideas, or whatever kind of day you’re having.</p>}
        {messages.map((message, index) => <div className={styles.chatMessage} data-speaker={message.role} key={index}><strong>{message.role === "user" ? "You" : "Anna"}</strong><p>{message.content}</p></div>)}
        <div ref={end} />
      </div>
      {!messages.length && <div className={styles.actions}>{starters.map(starter => <button className={styles.secondary} key={starter} disabled={busy} onClick={() => { setInput(starter); inputRef.current?.focus(); }}>{starter}</button>)}</div>}
      <form onSubmit={submit} className={styles.chatForm}>
        <label htmlFor="anna-message">Your message to Anna</label>
        <textarea ref={inputRef} id="anna-message" value={input} onChange={event => setInput(event.target.value)} maxLength={ANNA_MAX_TEXT} rows={3} disabled={busy || atLimit} placeholder="Share a thought…" aria-describedby="anna-chat-limit" />
        <div className={styles.chatControls}><small id="anna-chat-limit">{atLimit ? "Conversation limit reached. Start a new chat to continue." : `${input.length}/${ANNA_MAX_TEXT} characters`}</small><button className={styles.button} type="submit" disabled={busy || atLimit || !input.trim()}>{busy ? "Anna is replying…" : "Send to Anna"}</button><button className={styles.secondary} type="button" onClick={clear}>New chat</button></div>
      </form>
      {error && <p role="alert" className={styles.chatError}>{error}</p>}
    </div>}
  </section>;
}
