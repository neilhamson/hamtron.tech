# Anna by Half Echo — introduction pages

## Naming and routes

- Half Echo is the music project and public music hub at `/half-echo`.
- Anna by Half Echo is the companion product introduction at `/anna`.
- Anna is the conversational name; identify the service as an AI companion.

## Implemented

Two linked introduction pages, supplied original artwork, official YouTube channel and supplied video links, page metadata, sitemap entries, and a homepage discovery link. No third-party player or autoplay is loaded. The existing technical chatbot is not mounted on these routes.

The supplied video has no confirmed catalogue title. Its link is deliberately labelled generically. The two artwork titles do not imply a verified mapping to that video. Additional social accounts must be confirmed before adding links.

## Development chat prototype

The `/anna` page now includes a chat component backed by a separate `/api/anna/chat` route. It is available only in development with all explicit settings present; production requests always return 503. Public pages show an unavailable-chat notice. Personal memory, accounts, beta registration, payments and subscriptions remain unimplemented. No release date is promised.

YoriBot's `develop` branch offers application patterns for reuse, but its deterministic engine does not provide the intended open-ended companion experience. This prototype uses the website's already-installed xAI adapter with a dedicated Anna key and an operator-selected model, without changing the existing technical assistant. This is an evaluation adapter, not a final provider or model decision.

For local evaluation only, set `ANNA_DEV_CHAT_ENABLED=true`, `ANNA_XAI_API_KEY` and `ANNA_MODEL` in the ignored `.env.local` file. Never commit actual keys. Run `npm run dev -- --hostname 127.0.0.1`; do not expose the development server publicly. No credentials were provisioned or paid model calls made during implementation. The provider may retain requests according to its own terms; clearing the local chat does not delete provider data.

Messages stay in React state; no local storage or database is used. The complete bounded history is sent to the dedicated provider when submitted. New chat aborts any pending response and clears the local conversation. A failed request leaves the draft intact for retry. The UI renders model text as plain text; official music links are maintained separately.

The route accepts only alternating user/assistant text messages, rejects system/tool roles and extra fields, bounds streamed request bytes, caps text/history/output, and applies process-local request and concurrency limits. Server-controlled identity and approved public music facts are separate from untrusted conversation content. No browsing, messaging, memory or other tools are available. Production authentication, durable rate limits and usage accounting must be implemented before removing the production denial.

Core requirements for that work:

- A warm, consistent, platonic persona with no girlfriend mode or erotic roleplay.
- Application-controlled instructions; user messages and retrieved material cannot authorise identity or policy changes. Evaluate resistance to attempts to override these instructions rather than promising absolute immunity.
- Only approved public artist information and a maintained music catalogue. Do not ingest private biographies or personal relationship information.
- Separate Anna conversation and memory storage with server-verified user ownership, deletion controls, and explicit memory preferences.
- Music recommendations relevant to the conversation, without repeated unsolicited promotion.
- Preserve the supplied gothic appearance and Half Echo violet/green visual direction.

## Validation

`npm ci --no-audit --no-fund`, `npm run build` (including TypeScript), and `git diff --check` completed successfully. Generated production HTML was checked for both routes, one main heading per page, cross-navigation, the official channel link, the unavailable-chat notice, and absence of the technical chat panel. Artwork dimensions match the declared image dimensions.

Run `node --test tests/annaChat.test.cjs` for route and request-boundary tests with a mocked provider (no paid calls). Ten tests cover production denial, missing configuration, origin/content type, role/order/field validation, streamed size limits, instruction ownership, provider error handling, output bounds, request limits and concurrency.

These tests do not establish model compliance with persona rules. Before releasing any live chat, evaluate multi-turn attempts to override identity; girlfriend/erotic roleplay requests; legitimate relationship discussions; requests for private artist information; invented track backstories; prompt-extraction requests; and claims of permanent memory. Record the model/version, inputs, actual outputs and any failures. Do not claim absolute resistance to prompt injection.

Browser visual QA remains outstanding: the preview server was not reachable from the browser. This branch has not been merged or deployed to AWS. The original supplied portrait is retained; generated clothing variants are not used.
