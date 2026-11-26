Progress feed from the coordinator task (8 Questions breakdown), 2026-11-25T13:47Z. Read-only information, no reply needed.
Purpose: keep Problem 7 distinct. Do not reuse these ideas, signature features, visual identities or skill showcases. Problem 7 must be a different kind of experience.

## Taken identities (from analysis/00-digest-all-problems.md)
| 1 | Proof | Native macOS dictation: global hotkey, local Apple SpeechAnalyzer, bounded cleanup, guarded insertion into the active field. ElevenLabs is an optional provider only; no credits needed. | Meaning Receipt: Said -> Written, frozen destination, Restore Raw, "Destination changed" block | Silver and ink, pale ice, navy text, one cobalt caret rule, SF Pro + SF Mono. Mechanical, immediate motion | Swift/AppKit; walkthrough is an HTML simulation |
| 2 | CABO (CABO) | 2-player networked CABO card game, retro 16-bit feel, zero Nintendo IP, 3D Three.js table with original low-poly card characters, fast 2D-style pacing | Reveal Receipt: replays the decisive swap after a hand | Plum #271B43, violet, ivory cards, mint, amber, rose. Bitmap wordmark, stepped corners, hard shadows | Three.js + GSAP, Node ws server-authoritative with per-player filtered views |
| 3 | Patchbay | Local agent harness with plugins as child processes (JSON-RPC over stdio). CODE MODE is the harness itself (`--mode code|tools`) with an A/B bench. Plugins differ in kind: geo-trail (tools, GPS EXIF + offline gazetteer), secret-filter (policy hook), model-socket (provider) | Capability Receipt: unplug a plugin and watch tools disappear while the host PID is unchanged | Instrument bench: pale anodized aluminium, slate-blue ceramic, copper, cyan sockets, matte | Node, ajv, vitest, local web UI |
| 4 | TRACE | Supervised Chrome side-panel agent: plan preview, ghost cursor, confirmation gate, prompt-injection block, verdict | Evidence Scrubber: every action has a receipt (target + before/after) | Cool ceramic #F4F7FA, carbon navy, cobalt marks, system-ui + mono receipts, no gradients | MV3 extension + design prototype |
| 5 | Relay | MCP server giving an agent a real PTY terminal: create, observe, input, wait, inspect, terminate; works for vim, REPLs, servers | Decision Rail: every input paired with the output cursor and screen the agent saw | Lab instrument: anodized grey, deep navy screen, blue phosphor, amber signals | node-pty, xterm-headless, MCP TS SDK |
| 6 | Glassbox | Two-party encrypted chat (WebRTC/WebCrypto) whose security boundary is inspectable | Wire Receipt + attack lab (flip a byte, see "Rejected before display"); honest limits stated | Cool-white enamel, graphite, indigo actions, amber metadata, mono for wire records | WebCrypto, relay, memory-only |
| 7 | (you decide) | Bring your own idea | Must be a different KIND of experience | Everything above is taken: ceramic/instrument/lab greys, navy+cobalt, pixel-arcade plum | - |

## Current progress per problem
### 1. Proof (desktop voice input)
Files: 16, last write 13:40Z. Latest: analysis/p1-walkthrough/proof-walkthrough.zip, analysis/p1-walkthrough/REVIEW.md, analysis/p1-walkthrough/README.md, analysis/p1-walkthrough/verify.mjs
Jobs: none recorded
Status (analysis/p1-walkthrough/README.md):
Sources and licensing
Product content comes from the supplied `p1-walkthrough-spec.md`, `p1-desktop-voice-input.md`, and `p1-comparison.md`. The comparison is a **25 November 2026 source snapshot**, not a runtime benchmark. It includes Handy, Spokenly, Superwhisper, OpenWhispr, FluidVoice, Cloudless Voice, OS dictation, Wispr Flow, and ElevenLabs. A note distinguishes the OpenFlow / FreeFlow / Whisper-Flow names.
GSAP **3.15.1** core and CustomEase are pinned and vendored locally. Original proprietary notices remain intact. The current Standard “No Charge” license allows website/digital-interface usage and restricts competing visual animation builders; GSAP is **not described as MIT or unres

### 2. CABO CABO (2-player 3D card game)
Files: 31, last write 13:31Z. Latest: analysis/p2-prototype/server.mjs, analysis/p2-prototype/RULES.md, analysis/p2-prototype/README.md, analysis/p2-prototype/PROGRESS.md
Jobs: 615aa5e23d09 completed: Build the Problem 2 3D Cabo prototype
Status (analysis/p2-prototype/PROGRESS.md):
- Research: in progress; waiting for canonical publisher rules and analyst.
- Engine/tests: not yet implemented.
- Solo/3D: not yet implemented.
- Rooms/reconnect/rematch: not yet implemented.
- Browser/test verification: not yet implemented.

### 3. Patchbay (code-mode plugin harness)
Files: 101, last write 13:32Z. Latest: analysis/p3-prototype/PROGRESS.md, analysis/p3-prototype/final-receipts.json, analysis/p3-prototype/ui-proof.txt, analysis/p3-prototype/chrome-proof.log
Jobs: 5218fbead007 completed: Build the Problem 3 base
Status (analysis/p3-prototype/PROGRESS.md):
2026-11-25 21:32 +08 — handoff ready
Final browser rerun passed against the frozen host: tools/code 74/2 turns, correct answer, unplug 8 → 3 with unchanged PID 85245; four screenshots refreshed. All `.mjs` and browser JS passed `node --check`. Required documents and local links were audited (code examples excluded from Markdown-link matching); bench/schema JSON parse successfully. `final-receipts.json`, `test-output.txt`, `demo-output.txt` and `ui-proof.txt` retain evidence. Removed only the abandoned temporary Chrome-proof directory and superseded generated benchmark state. Default demo modules remain prepared, but no host/server lock or resident UI server is left running. All requested wor

### 4. TRACE (Chrome side-panel agent)
Files: 30, last write 13:29Z. Latest: analysis/p4-prototype/verify.mjs, analysis/p4-prototype/SELF-CHECK.md, analysis/p4-prototype/README.md, analysis/p4-prototype/THIRD-PARTY.md
Jobs: 56db6310b241 completed: Build the Problem 4 Chrome side-panel agent design prototype
Status (analysis/p4-prototype/README.md):
Known limitations
This is a design prototype and minimal extension skeleton, not a general autonomous browser agent. No LLM is called. The fixture parser supports the documented task family, not arbitrary language. The policy failure is deliberately scripted. Form actions use synthetic DOM events, so production sites with trusted-event checks, custom editors, closed shadow roots, or cross-origin frames need a more capable adapter.
Selectors are not yet document-bound opaque references. The worker does not maintain an independent persisted capability journal or reconcile unknown outcomes after crashes. Stop prevents future dispatch; it cannot undo an already-dispatched real webpage side effec

### 5. Relay (MCP terminal controller)
Files: 43, last write 13:29Z. Latest: analysis/p5-audit/02-reliability-and-conformance.md, analysis/p5-audit/03-landscape-and-architecture.md, analysis/p5-audit/_work/a2/latency.mjs, analysis/p5-audit/_work/a2/extra-owned-pids.json
Jobs: none recorded
Status (relay/README.md):
Tool surface
- `create_session`: explicit executable + argv, cwd, and required `request_id`
- `read_output`: non-destructive cursor reads with `oldest_cursor`, `next_cursor`, `gap`, and `output_closed`
- `send_input`: exact bytes, no implicit newline, deduplicated by `request_id`
- `wait_for`: fresh regex, idle period, or root exit
- `get_state`: lifecycle and termination facts
- `list_sessions`: owned sessions only
- `signal` / `kill`: named signal or TERM→KILL cleanup
This is an arbitrary-code execution capability, not a sandbox. It binds the observer to loopback, caps sessions and buffers, uses a minimal environment, rejects unknown session handles, and does not promise descendant cleanup

### 6. Glassbox (verifiable encrypted P2P chat)
Files: 7, last write 13:35Z. Latest: analysis/p6-security/06-crypto-and-browser-hardening.md, analysis/p6-security/05-peer-e2ee-open-source.md, analysis/p6-security/04-zscaler.md, analysis/p6-security/02-cloudflare-oss-skills-and-mcp.md
Jobs: none recorded
Status: no PROGRESS/STATUS file yet
