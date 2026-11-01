"use client";

import { useChat } from "@ai-sdk/react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ConversationState } from "@/lib/conversationState";
import {
  productConfig,
  projectMailtoHref,
  type WorkflowMode,
} from "@/lib/productConfig";
import { MAX_CHAT_MESSAGES, MAX_INPUT_CHARS } from "@/lib/interfaceLimits";
import {
  formatProjectEnquiryText,
  prepareProjectEnquiry,
  type ProjectEnquiry,
} from "@/lib/projectEnquiry";
import styles from "./SiteChatLauncher.module.css";

const quickPrompts = productConfig.launcher.prompts;

export default function SiteChatLauncher() {
  const pathname = usePathname();
  if (pathname === "/anna" || pathname.startsWith("/anna/") || pathname === "/half-echo" || pathname.startsWith("/half-echo/")) {
    return null;
  }
  return <TechnicalChatLauncher />;
}

function TechnicalChatLauncher() {
  const pathname = usePathname();
  const bitcoinProductRoute = pathname.startsWith("/bitcoin");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [footerVisible, setFooterVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [workflowMode, setWorkflowMode] =
    useState<WorkflowMode>("general");
  const [projectState, setProjectState] =
    useState<ConversationState | null>(null);
  const [stateStatus, setStateStatus] = useState<
    "idle" | "updating" | "ready" | "error"
  >("idle");
  const [preparedEnquiry, setPreparedEnquiry] =
    useState<ProjectEnquiry | null>(null);
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const [projectStateExpanded, setProjectStateExpanded] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const latestAssistantRef = useRef<HTMLElement | null>(null);
  const lastSubmittedTextRef = useRef("");
  const processedAssistantRef = useRef<string | null>(null);
  const stateRequestInFlightRef = useRef<string | null>(null);

  const {
    messages,
    sendMessage,
    setMessages,
    status,
    error,
    clearError,
  } = useChat();

  const isBusy = status === "submitted" || status === "streaming";
  const conversationLimitReached = messages.length >= MAX_CHAT_MESSAGES;

  const readinessScore = projectState
    ? Math.max(0, Math.min(100, projectState.readiness.score))
    : 0;

  const canPrepareEnquiry =
    projectState !== null &&
    stateStatus === "ready" &&
    projectState.readiness.status === "ready" &&
    projectState.objective !== null;

  let latestAssistantMessageId: string | null = null;
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === "assistant") {
      latestAssistantMessageId = messages[index].id;
      break;
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 720);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer.site-footer");

    if (!footer || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const node = scrollRef.current;
    if (!node) {
      return;
    }

    if (status === "submitted" || status === "streaming") {
      node.scrollTop = node.scrollHeight;
      return;
    }

    if (status !== "ready" || !latestAssistantRef.current) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const scroller = scrollRef.current;
      const target = latestAssistantRef.current;

      if (!scroller || !target) {
        return;
      }

      const scrollerRect = scroller.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      scroller.scrollTop += targetRect.top - scrollerRect.top;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, open, status]);

  useEffect(() => {
    if (status === "error" && !input && lastSubmittedTextRef.current) {
      setInput(lastSubmittedTextRef.current);
    }
  }, [input, status]);

  useEffect(() => {
    if (workflowMode !== "project_enquiry") {
      return;
    }

    if (status !== "ready" || messages.length === 0) {
      return;
    }

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== "assistant") {
      return;
    }

    if (processedAssistantRef.current === lastMessage.id) {
      return;
    }

    if (stateRequestInFlightRef.current === lastMessage.id) {
      return;
    }

    stateRequestInFlightRef.current = lastMessage.id;
    setPreparedEnquiry(null);
    setCopyStatus("idle");
    setStateStatus("updating");

    void (async () => {
      try {
        const response = await fetch("/api/state", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
          throw new Error(
            `State request failed with status ${response.status}`,
          );
        }

        const state = (await response.json()) as ConversationState;

        setProjectState(state);
        processedAssistantRef.current = lastMessage.id;
        setStateStatus("ready");
      } catch (stateError) {
        console.error("Project state update failed:", stateError);
        setStateStatus("error");
      } finally {
        if (stateRequestInFlightRef.current === lastMessage.id) {
          stateRequestInFlightRef.current = null;
        }
      }
    })();
  }, [messages, status, workflowMode]);

  function resetProjectWorkflow() {
    setProjectState(null);
    setPreparedEnquiry(null);
    setCopyStatus("idle");
    setProjectStateExpanded(false);
    setStateStatus("idle");
    processedAssistantRef.current = null;
    stateRequestInFlightRef.current = null;
  }

  function selectPrompt(prompt: (typeof quickPrompts)[number]) {
    setInput(prompt.text);
    setWorkflowMode(prompt.mode);
    resetProjectWorkflow();
    clearError();
  }

  function resetChat() {
    setMessages([]);
    setInput("");
    setWorkflowMode("general");
    resetProjectWorkflow();
    clearError();
    lastSubmittedTextRef.current = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();

    if (
      !text ||
      isBusy ||
      conversationLimitReached ||
      text.length > MAX_INPUT_CHARS
    ) {
      return;
    }

    lastSubmittedTextRef.current = text;
    clearError();
    setInput("");

    try {
      await sendMessage({ text });
    } catch (submissionError) {
      console.error("Site chat submission failed:", submissionError);
      setInput(text);
    }
  }

  function handlePrepareEnquiry() {
    if (!projectState || !canPrepareEnquiry) {
      return;
    }

    setPreparedEnquiry(prepareProjectEnquiry(projectState));
    setCopyStatus("idle");
  }

  async function handleCopyEnquiry() {
    if (!preparedEnquiry) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        formatProjectEnquiryText(preparedEnquiry),
      );
      setCopyStatus("copied");
    } catch (copyError) {
      console.error("Enquiry copy failed:", copyError);
      setCopyStatus("error");
    }
  }

  const missingInformation =
    projectState?.readiness.missingCriticalInformation ?? [];

  return (
    <div
      className={`${styles.root} ${footerVisible ? styles.rootFooterVisible : ""} ${bitcoinProductRoute ? styles.bitcoinProductRoute : ""}`}
    >
      {open && (
        <section
          id="site-technical-chat"
          className={styles.panel}
          role="dialog"
          aria-modal="false"
          aria-label={productConfig.launcher.ariaLabel}
        >
          <div className={styles.header}>
            <div>
              <div className={styles.eyebrow}>{productConfig.launcher.eyebrow}</div>
              <div className={styles.headerTitle}>{productConfig.launcher.title}</div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className={styles.closeButton}
              aria-label="Close technical chat"
            >
              ×
            </button>
          </div>

          <div className={styles.statusBar}>
            <span className={styles.onlineGroup}>
              <span className={styles.onlineDot} aria-hidden="true" />
              ONLINE
            </span>
            <span>
              {status === "streaming"
                ? "STREAMING"
                : status === "submitted"
                  ? "PROCESSING"
                  : workflowMode === "project_enquiry"
                    ? "PROJECT MODE"
                    : "READY"}
            </span>
          </div>

          <div ref={scrollRef} className={styles.conversation} aria-live="polite">
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{productConfig.launcher.emptyState}</p>

                <div className={styles.quickPrompts}>
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.label}
                      type="button"
                      onClick={() => selectPrompt(prompt)}
                    >
                      <span>{prompt.label}</span>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.messages}>
                {messages.map((message) => (
                  <article
                    key={message.id}
                    ref={
                      message.role === "assistant" &&
                      message.id === latestAssistantMessageId
                        ? latestAssistantRef
                        : undefined
                    }
                    className={
                      message.role === "user"
                        ? styles.userMessage
                        : styles.assistantMessage
                    }
                  >
                    <div className={styles.roleLabel}>
                      {message.role === "user" ? "VISITOR" : "INTERFACE"}
                    </div>

                    <div className={styles.messageBody}>
                      {message.parts.map((part, index) =>
                        part.type === "text" ? (
                          message.role === "assistant" ? (
                            <div key={`${message.id}-${index}`} className={styles.markdown}>
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  a: ({ node: _node, ...props }) => (
                                    <a
                                      {...props}
                                      target="_blank"
                                      rel="noreferrer"
                                    />
                                  ),
                                }}
                              >
                                {part.text}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <div key={`${message.id}-${index}`} className={styles.preWrap}>
                              {part.text}
                            </div>
                          )
                        ) : null,
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {error && (
              <div className={styles.error} role="alert">
                The chat request failed. Your last message has been restored so
                you can retry it.
              </div>
            )}

            {conversationLimitReached && (
              <div className={styles.notice} role="status">
                Conversation limit reached. Start a new chat to continue.
              </div>
            )}
          </div>

          {workflowMode === "project_enquiry" && (
            <section
              className={styles.projectDock}
              aria-label="Project enquiry progress"
              aria-busy={stateStatus === "updating"}
            >
              <button
                type="button"
                className={styles.projectDockToggle}
                onClick={() =>
                  setProjectStateExpanded((current) => !current)
                }
                aria-expanded={projectStateExpanded}
                aria-controls="site-project-state-details"
              >
                <span className={styles.projectDockMain}>
                  <span className={styles.projectDockLabel}>
                    {canPrepareEnquiry
                      ? "PROJECT ENQUIRY READY"
                      : "PROJECT ENQUIRY"}
                  </span>
                  <span className={styles.projectDockSummary} aria-live="polite">
                    {stateStatus === "updating"
                      ? projectState
                        ? "Updating project state"
                        : "Analysing project conversation"
                      : stateStatus === "error"
                        ? "Update failed · open for details"
                        : canPrepareEnquiry
                          ? "Ready to review"
                          : projectState
                            ? missingInformation.length > 0
                              ? `${missingInformation.length} critical detail${missingInformation.length === 1 ? "" : "s"} still needed`
                              : "Details being established"
                            : "Building project summary"}
                  </span>
                </span>

                <span className={styles.projectDockMeta}>
                  <strong>
                    {projectState
                      ? `${readinessScore}%`
                      : stateStatus === "updating"
                        ? "…"
                        : "0%"}
                  </strong>
                  <span className={styles.projectDockAction}>
                    {projectStateExpanded
                      ? "HIDE"
                      : canPrepareEnquiry
                        ? "REVIEW"
                        : "VIEW"}
                  </span>
                  <span className={styles.projectDockGlyph} aria-hidden="true">
                    {projectStateExpanded ? "−" : "+"}
                  </span>
                </span>
              </button>

              <div className={styles.projectDockTrack} aria-hidden="true">
                <div
                  className={styles.projectDockFill}
                  style={{ width: `${readinessScore}%` }}
                />
              </div>

              <div
                id="site-project-state-details"
                className={styles.projectDockDetails}
                hidden={!projectStateExpanded}
              >
                  {stateStatus === "error" && (
                    <div className={styles.projectStateError} role="alert">
                      The latest Project State update failed. Enquiry preparation
                      is disabled until a new update succeeds.
                    </div>
                  )}

                  {!projectState ? (
                    <div className={styles.projectStateEmpty}>
                      The interface will build a structured project summary as
                      the conversation develops.
                    </div>
                  ) : (
                    <div className={styles.projectStateBody}>
                      <div className={styles.projectStateStatusLine}>
                        <span>STATE</span>
                        <strong>
                          {projectState.readiness.status.toUpperCase()}
                        </strong>
                      </div>

                      <div className={styles.projectObjectiveLabel}>OBJECTIVE</div>
                      <div className={styles.projectObjective}>
                        {projectState.objective ?? "Not established yet."}
                      </div>

                      {missingInformation.length > 0 && (
                        <div className={styles.missingBlock}>
                          <div>CRITICAL INFORMATION STILL NEEDED</div>
                          <ul>
                            {missingInformation.slice(0, 3).map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                          {missingInformation.length > 3 && (
                            <span>
                              + {missingInformation.length - 3} more item
                              {missingInformation.length - 3 === 1 ? "" : "s"}
                            </span>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handlePrepareEnquiry}
                        disabled={!canPrepareEnquiry}
                        className={styles.prepareButton}
                      >
                        {stateStatus === "updating"
                          ? "STATE UPDATING"
                          : preparedEnquiry
                            ? "REFRESH ENQUIRY"
                            : "PREPARE ENQUIRY"}
                      </button>

                      {!canPrepareEnquiry && stateStatus !== "error" && (
                        <div className={styles.prepareNote}>
                          Continue the project conversation until the required
                          information is established.
                        </div>
                      )}

                      {preparedEnquiry && (
                        <div className={styles.enquiryDraft}>
                          <div className={styles.enquiryDraftMeta}>
                            DRAFT ARTEFACT · VERSION {preparedEnquiry.version} · {" "}
                            READINESS {preparedEnquiry.readiness.score}%
                          </div>

                          <div className={styles.enquiryDraftObjective}>
                            {preparedEnquiry.objective ?? "Objective not established."}
                          </div>

                          <div className={styles.enquiryDraftActions}>
                            <button
                              type="button"
                              onClick={() => void handleCopyEnquiry()}
                            >
                              {copyStatus === "copied"
                                ? "ENQUIRY COPIED"
                                : "COPY ENQUIRY"}
                            </button>

                            <a href={projectMailtoHref()}>
                              {productConfig.launcher.emailLabel}
                            </a>
                          </div>

                          <div className={styles.enquiryDraftNote}>
                            {copyStatus === "copied" &&
                              "Copied to your clipboard. Open your email and paste the enquiry."}
                            {copyStatus === "error" &&
                              productConfig.launcher.copyBlockedMessage}
                            {copyStatus === "idle" &&
                              productConfig.launcher.copyIdleMessage}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </section>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={productConfig.launcher.inputPlaceholder}
              maxLength={MAX_INPUT_CHARS}
              rows={2}
              disabled={isBusy || conversationLimitReached}
              className={styles.textarea}
              aria-label="Technical chat message"
            />

            <div className={styles.formFooter}>
              <span>
                {input.length.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()}
              </span>

              <button
                type="submit"
                disabled={
                  !input.trim() ||
                  isBusy ||
                  conversationLimitReached ||
                  input.length > MAX_INPUT_CHARS
                }
                className={styles.sendButton}
              >
                {isBusy ? "WAIT" : "SEND"}
              </button>
            </div>
          </form>

          <div className={styles.panelFooter}>
            <a href="/#technical-interface">OPEN FULL INTERFACE</a>

            {messages.length > 0 && (
              <button type="button" onClick={resetChat} disabled={isBusy}>
                NEW CHAT
              </button>
            )}
          </div>
        </section>
      )}

      {showBackToTop && !open && (
        <button
          type="button"
          className={styles.backToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <span aria-hidden="true">↑</span>
          <strong>TOP</strong>
        </button>
      )}

      <button
        type="button"
        className={styles.launcher}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="site-technical-chat"
        aria-label={open ? "Close technical chat" : "Open technical chat"}
      >
        <span className={styles.launcherDot} aria-hidden="true" />
        <span className={styles.launcherText}>
          <strong>
            {open
              ? productConfig.launcher.openLabel
              : productConfig.launcher.closedLabel}
          </strong>
          <span>
            {open
              ? productConfig.launcher.openSubtitle
              : productConfig.launcher.closedSubtitle}
          </span>
        </span>
      </button>
    </div>
  );
}
