# Anna by Half Echo — introduction pages

## Naming and routes

- Half Echo is the music project and public music hub at `/half-echo`.
- Anna by Half Echo is the companion product introduction at `/anna`.
- Anna is the conversational name; identify the service as an AI companion.

## Implemented

Two linked introduction pages, supplied original artwork, official YouTube channel and supplied video links, page metadata, sitemap entries, and a homepage discovery link. No third-party player or autoplay is loaded. The existing technical chatbot is not mounted on these routes.

The supplied video has no confirmed catalogue title. Its link is deliberately labelled generically. The two artwork titles do not imply a verified mapping to that video. Additional social accounts must be confirmed before adding links.

## Companion implementation still required

These pages do not implement Anna chat, personal memory, accounts, beta registration, payments, or subscriptions. No release date is promised.

YoriBot's `develop` branch offers application patterns for reuse, but its current deterministic conversation engine does not provide the intended open-ended companion experience. Choose and evaluate Anna's conversation engine separately.

Core requirements for that work:

- A warm, consistent, platonic persona with no girlfriend mode or erotic roleplay.
- Application-controlled instructions; user messages and retrieved material cannot authorise identity or policy changes. Evaluate resistance to attempts to override these instructions rather than promising absolute immunity.
- Only approved public artist information and a maintained music catalogue. Do not ingest private biographies or personal relationship information.
- Separate Anna conversation and memory storage with server-verified user ownership, deletion controls, and explicit memory preferences.
- Music recommendations relevant to the conversation, without repeated unsolicited promotion.
- Preserve the supplied gothic appearance and Half Echo violet/green visual direction.

## Validation

`npm ci --no-audit --no-fund`, `npm run build` (including TypeScript), and `git diff --check` completed successfully. Generated production HTML was checked for both routes, one main heading per page, cross-navigation, the official channel link, the unavailable-chat notice, and absence of the technical chat panel. Artwork dimensions match the declared image dimensions.

Browser visual QA remains outstanding: the preview server was not reachable from the browser. This branch has not been merged or deployed to AWS.
