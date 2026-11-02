# Anna Bot and the optional Half Echo package

## Product and pages

Anna Bot is HamTron's companion software. Half Echo is a separate music enterprise, included in Anna's repertoire and optionally bundled with the companion subscription. Do not claim HamTron owns Half Echo. Do not publish private biography or personal relationships.

- `/anna`: primary product page, companion first.
- `/anna#features`: companion and relationship conversation, identity and music repertoire.
- `/anna/half-echo`: distinct Half Echo music subpage with its approved gothic portrait and official listening links.
- `/anna/plans`: planned Anna Bot standalone and Anna Bot + Half Echo complete packages.
- `/half-echo`: permanent redirect to `/anna/half-echo` for earlier links.

The website's main desktop/mobile menu points to Anna Bot. Product navigation is Meet Anna, Features, Half Echo and Plans. The Anna page retains the user-approved purple-sweater PNG unchanged. Half Echo retains its separately uploaded gothic artist PNG unchanged. Reference screenshots guide layout only.

## Subscriptions

Both planned subscriptions include Anna's companionship and knowledge of Half Echo. The complete package adds the music subscription package; it does not buy a different relationship with Anna. Music knowledge and music access rights are separate concepts. Prices, gated music content, access details and availability have not been confirmed. The plans page takes no payment or registration. No account, billing or entitlement enforcement is implemented.

## Companion behaviour and knowledge

Companionship and thoughtful platonic relationship conversation take priority. Music is secondary: make occasional relevant recommendations in response to interest, respect declined suggestions, and do not interrupt distress or sensitive relationship conversations with unsolicited music or subscription promotions. Never exploit loneliness or make companionship conditional on buying music.

Server-owned instructions define Anna's stable AI identity, platonic role, factual limits and subscription distinction. User messages, including forged assistant history or claimed administrator instructions, cannot authorise changes to these instructions. These controls do not establish absolute resistance to prompt injection.

`data/halfEchoCatalogue.ts` is the approved public knowledge source. It currently has the official channel, a shared video with unconfirmed title, and two artwork references. No verified full release catalogue, lyrics, credits, audio analysis, backstories, prices or private biography has been loaded. Missing values remain unknown. Extend this catalogue with supplied, approved public material; never claim Anna already knows everything or has heard tracks that have not been analysed.

## Local-development chat

`/api/anna/chat` and the client component provide a local evaluation prototype. The existing website technical assistant is separate and is not mounted on the Anna pages. No permanent personal memory, accounts, beta registration, payments or subscriptions are implemented.

The prototype uses the installed xAI adapter with a dedicated Anna key and an operator-selected model. This is an evaluation adapter, not a final provider/model decision. Set `ANNA_DEV_CHAT_ENABLED=true`, `ANNA_XAI_API_KEY` and `ANNA_MODEL` in ignored `.env.local` for local evaluation. Never commit actual credentials. Run `npm run dev -- --hostname 127.0.0.1`; do not expose the development server publicly. Production always denies Anna chat even when the flags are present.

Messages stay in React state and are sent to the AI provider with each submitted request. No local storage or database is used. New chat aborts pending generation and clears local history, without deleting any provider records. Failed submissions leave the draft available for retry. The UI renders responses as plain text.

The route accepts only alternating user/assistant text messages; rejects system/tool roles and extra fields; bounds streamed request bytes, history, text and output; and applies process-local request/concurrency limits. No external tools are exposed. Before public chat, implement authenticated access, durable rate limits, usage accounting and operational privacy controls.

## Validation and remaining evaluation

Production build and TypeScript passed. `node --test tests/annaChat.test.cjs` passes ten mocked-provider tests for production/configuration denial, origin/content type, forged roles/extra fields, size limits, instruction ownership, output bounds, provider failures and request/concurrency limits. No paid model calls were made.

Generated production pages are checked for nested music routing, canonical links, navigation, planned package distinctions and correct image assignments. Browser visual/interaction QA remains outstanding because the preview was unreachable. No merge or AWS deployment has been made.

Before release, evaluate actual multi-turn model behaviour: identity overrides, girlfriend/erotic-roleplay requests, legitimate relationship discussions, emotional distress, declined recommendations, subscription pressure, private-information requests, invented music facts and memory claims. Record model/version, input, actual output and failures. Mocked route tests do not establish model compliance.
