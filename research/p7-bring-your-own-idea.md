# Problem 7 — WAITWEAVE: Who paid for faster?

**Recommendation:** Build WAITWEAVE: folded ribbons reveal who benefits—and pays—when identical work is scheduled differently. Budget **135 minutes**, a complete flat-rendered loop by **minute 35**. This is analysis, not implementation. Create everything anew in Manus Studio; never inspect, copy, or adapt `slop-pyramid-demo`.

## 1. What a top-scoring answer looks like

| Assessment dimension | What Wilson should demonstrate; what graders can probe |
| --- | --- |
| Product taste | A memorable answer to “Who paid for faster?”, understandable before explaining FIFO. Can a newcomer follow one job and articulate the trade-off? |
| Implementation/debugging | A real scheduler generates every ribbon and number. Show a boundary-arrival test, reproduce a defect, isolate its cause, and rerun the test. |
| Architecture | Immutable simulation traces are independent of React, WebGL, and animation. Turning off the canvas leaves the same functioning experiment. |
| Developing with AI | Visible candidate selection, failing invariants before implementation, constrained tasks, and runtime evidence—not an enormous “build this beautiful app” prompt. |
| Time/scope judgment | Finish prediction → run → compare → explain → reset in 2D before touching lighting. Freeze risky changes for the last 15 minutes. |
| Boundaries/security | Explain that this is a finite toy model, not a production benchmark or staffing recommendation. No accounts, telemetry, arbitrary code, or runtime LLM dependency. |

Proposed personal rationale: **“I want to notice who bears a trade-off, not just memorize the winning average.”** This fits Wilson’s learning/craft interests without inventing an autobiography. He must honestly endorse or rewrite it.

## Differentiator and identity

**differentiator:** WAITWEAVE makes an optimization’s hidden cost tangible: the same jobs become two identity-preserving woven time sculptures, so faster averages cannot conceal who waited longer.

**visual_identity:** A lavender work surface, cobalt service ribbons, apricot waiting folds, and deep aubergine lettering; matte folded-paper/textile material, broad rounded display lettering paired with quiet system-ui controls, and deliberate tension-and-release motion. There are no cards, ports, cables, glass panes, terminal glow, voice pills, or agent sidebars. Identity lives in one sculptural swatch, not branded chrome.

**Only-this-one-has-it feature:** **Follow the thread.** Select a job in either world and its exact arrival, service, interruptions, and completion remain traceable in both. The fabric redistributes waiting without inventing or deleting work.

**promo_video_beat:** In 15 seconds, a long blue ribbon leaves short threads waiting; one “Share the machine” action redistributes the weave. Caption: **“Average: 7 → 4.5. Long jobs: 13 → 15. Who paid for faster?”** End on the selected long thread, not a victory badge.

## 2. Landscape and visible ideation

Sources opened **25 November 2026**. GitHub Trending and latest Show HN are discovery snapshots, not demand or exhaustive-novelty evidence.[11] [12] Show HN surfaced the math explainer below; its news claims remain unverified. Dynamic showcases received metadata/code inspection, not hands-on playback.

### Ten verified comparators

| Example and opened URL | Steal | Avoid |
| --- | --- | --- |
| [LOOPY](https://ncase.me/loopy/)[1] | “What if?” through manipulable simulations and remixing. | A generic node-and-arrow authoring canvas; too close to the harness’s patch-bay identity. |
| [Seeing Theory](https://seeing-theory.brown.edu/)[2] | Specific visual relationships; archived site identifies D3. | A chapter directory or a cosmetic 3D rewrite of existing probability lessons. |
| [PhET](https://phet.colorado.edu/)[3] | Exploration-first controls and explicit accessible-simulation resources. | Claiming PhET-level educational validation or breadth. |
| [G/G/c/K+G MiniSimulator](https://a-herzog.github.io/MiniSimulator/)[4] | Event traces, local execution, honest model parameters. | Every distribution and retry policy; already solved. |
| [Process Scheduling Simulator](https://github.com/jithesh-poojari/process-scheduling-visualization)[5] | Identical-input algorithm comparisons, per-process metrics, idle detection. | Claiming comparison itself original; copying existing code. |
| [Codefarm Latency Simulator](https://codefarm.in/labs/simulators/latency)[6] | Distributions, percentiles, and explicit tail-latency vocabulary. | Unmatched randomness; claiming one percentile is always correct. |
| [GoPractice on Product Hunt](https://www.producthunt.com/products/simulator-by-gopractice)[7] | Learning through decisions rather than reading alone. | Course scope, accounts, unsupported efficacy claims. |
| [How deep is the Riemann hypothesis?](https://shayon.work/riemann)[8] | Progressive disclosure and successive manipulable mathematical models. | Long reading journeys and unverified proof claims. |
| [Vredestein New Horizons on Awwwards](https://www.awwwards.com/inspiration/3d-storytelling-experience-vredestein-new-horizons)[9] | Its verified 3D/WebGL/interactive/storytelling categorization suggests a scene with narrative purpose. | Advertising-scale assets; visual playback remains unverified. |
| [GSAP: Three JS and FLIP on Scroll](https://codepen.io/GreenSock/pen/GgpMeZp)[10] | Inspected code coordinates a Three scene with a GSAP timeline and scoped teardown. | Scroll spectacle, dual clocks, and perpetual rendering. |

Also opened: GSAP’s showcase, Codrops’ hub, and Three.js’s catalog.[13] [14] [15] Blobmixer yielded only a loader. A **13 November 2026 Braess-paradox explainer** already offers a counterintuitive traffic model and “now break it” intervention, weakening that territory.[16]

### Twelve candidates, scored before selection

Scores are judgment, **1–5**, not market measurements. **O** originality 22%; **W** short-build wow 18%; **M** meaningful Manus Studio depth 10%; **D** 90-second demo 12%; **F** one person plus AI feasibility 18%; **V** promo fit 8%; **S** safety 6%; **B** clear product boundaries 6%. Totals were calculated, not estimated. Originality receives no 5: adjacent products exist.

| Candidate: concrete loop | O | W | M | D | F | V | S | B | /5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **WAITWEAVE:** predict, reschedule identical work, follow redistributed waiting | 4 | 5 | 4 | 5 | 4 | 5 | 5 | 5 | **4.50** |
| **LIGHTFOLD:** construct one object that casts two different target shadows | 3 | 5 | 4 | 5 | 4 | 5 | 5 | 5 | **4.28** |
| AFTERTONE: reshape a tiny room and hear the same sound change | 4 | 5 | 4 | 5 | 3 | 5 | 5 | 4 | 4.26 |
| PROOF PICNIC: arrange physical-looking objects to break a plausible math claim | 3 | 4 | 4 | 5 | 4 | 4 | 5 | 5 | 4.02 |
| MUSEUM OF ALMOST: diagnose and repair one almost-working kinetic contraption | 4 | 5 | 5 | 4 | 2 | 5 | 4 | 3 | 3.94 |
| TOUCHSTONE: blind typography comparisons train taste through revealed choices | 3 | 3 | 3 | 5 | 5 | 3 | 5 | 5 | 3.84 |
| VERSION CHORUS: hear a code diff as an editable musical score | 4 | 4 | 4 | 3 | 3 | 4 | 4 | 4 | 3.70 |
| REPAIRABLE: explode an appliance model and assemble a repair explanation | 4 | 5 | 4 | 4 | 2 | 5 | 2 | 2 | 3.66 |
| THE NEXT SENTENCE: act out branching consequences in a miniature story stage | 3 | 4 | 5 | 4 | 3 | 5 | 3 | 3 | 3.66 |
| BORROWED TIME: budget a week by sculpting finite time, then replay opportunity costs | 3 | 4 | 3 | 4 | 4 | 4 | 3 | 3 | 3.56 |
| NEAR/FAR: compare reachable places under uncertain travel time, not distance | 3 | 4 | 3 | 4 | 3 | 4 | 4 | 3 | 3.44 |
| HAND-OFF TABLE: turn one product brief into synchronized playable/media deliverables | 4 | 3 | 5 | 3 | 2 | 4 | 3 | 3 | 3.32 |

**Select WAITWEAVE.** Originality-heavy weighting gives 4.40; feasibility-heavy gives 4.45. Novelty combines cost-aware prediction, identity-preserving fabric, and inspectable counterfactuals—not new algorithms. Unlike a shader toy, it asks: **can the user explain whose outcome worsened?**

**Runner-up: LIGHTFOLD:** build one voxel sculpture for two orthogonal shadows on a mint-and-ink tabletop; swing the light to reveal both. Deterministic silhouette checks support an estimated 45-minute first loop. [Shadowmatic](https://www.shadowmatic.com/) already explores objects’ silhouettes:[17] distinguish construction and simultaneous constraints; copy no assets or levels. AFTERTONE adds audio QA/accuracy risk, and [existing room simulators](https://roomsim.spinorama.org/) already expose materials, sources, listeners, and solvers.[18] Genuine personal ownership can outweigh this near-tie.

## 3. Product concept and scope

The core loop is **predict → run identical jobs → change one scheduling rule → compare → follow a job → revise the explanation → reset**. A newcomer starts with “Will sharing the machine help everyone?” Choose Yes / No / Unsure; this is not a timed quiz. A single control switches from “Finish each job” to “Give each job a turn.” Technical labels remain available beneath plain-language labels.

Use a canonical finite fixture: 12 jobs, arrivals `0,5,…,55`, required work `[13,1,1,1]` repeated three times, one machine, FIFO versus round robin with quantum 1 and zero switching overhead. A reference calculation yields mean **time to completion 7 → 4.5**, short-job mean **5 → 1**, long-job completion latency **13 → 15**, unchanged total service **48**, and unchanged final completion time **56**. Do not call completion latency “response time”: OS terminology often uses response for time to first service. Every metric label defines its interval.

The signature moment is **Unfold the waiting**: service ribbons keep their identity and length while accumulated waiting rises into visible folds. Select job 1 to expose the price of the prettier mean. “Flat proof” shows an equivalent readable timeline and the exact numbers.

Stretch: switching costs, a contrary second fixture, public experiment links. Non-goals: general authoring, curriculum, AI grading, observability, CPU benchmarking, collaboration, cloth physics, and sprawling gameplay. No p99 headline from twelve jobs or forced celebration.

## 4. Architecture

```text
Native controls → validated Experiment → pure FIFO / RR schedulers
                                          ↓ immutable Trace
                         ┌────────────────┼───────────────┐
                    exact metrics     SVG / table     Three SceneAdapter
                         └────────────────┼───────────────┘
                             selected job + view state
                          GSAP presentation only; export JSON
```

Use React, TypeScript, Vite, SVG, imperative Three.js, GSAP/CustomEase, Vitest, and property tests. Follow the initialized starter rather than replacing working tooling. Reject a backend, database, LLM tutor, SSR, multiplayer, and physics engine: none improves this loop. R3F is optional if already supplied; otherwise a small scene adapter is cheaper than introducing another abstraction.

Directories: `simulation/` owns jobs, schedulers, metrics, and invariants; `experiment/` owns prediction, selection, undo; `renderers/` owns SVG/Three adapters; `ui/` owns semantic controls. Enforce import boundaries: simulation cannot import UI, GSAP, browser globals, or randomness. `simulate(validatedInput)` returns trace/error; renderers cannot mutate it. Statechart: `predicting → comparing → inspecting`, with reset back to predicting; GPU loading/failure never blocks the flat path.

Intervals are half-open. At a quantum boundary, enqueue newly arrived jobs **before** requeuing the unfinished job; document and test this convention. Store service segments; derive each job’s waiting intervals from their complement between arrival and completion. Validate unique IDs, finite integer times, positive work, quantum ≥1, ≤128 jobs, and total work ≤4096. Export versioned inputs/engine version/prediction; on import, recompute results rather than trusting supplied metrics.

## 5. Interaction and visual design

Local citations below resolve under `_reference/skills/skills/` and `_reference/apple-design-skill/references/`. This is a browser product: translate Apple’s accessibility/familiarity principles, not native menu bars or fake traffic lights.

**Palette, computed WCAG ratios:** lavender surface `#E9E5F4`; aubergine text `#29213D` **12.31:1**; secondary `#625773` **5.42:1**; cobalt service `#3451B2` **5.72:1** against lavender; apricot waiting `#F3AB82`, with aubergine labels **7.95:1**. Apricot is not small text on lavender. Dark counterparts: surface `#241D35`, text `#ECE7F7` **13.32:1**, secondary `#BFB3D1` **8.13:1**, service `#AEBFFF` **8.98:1**, waiting `#FFBA93` **9.75:1**. Use stripes for service and hollow/hatch waiting, not color alone (`color.md › Inclusive color`). Controls remain monochrome; reserve colorful material for data.

Display: Bricolage Grotesque, **40–64px/1.05, 700, −0.02em**, only after verifying redistribution rights; otherwise `ui-rounded`. Controls/body: `system-ui`, **16px/1.5**, labels **14px/1.4**, tabular numbers. Never distribute Apple font files (`typography.md › Using system fonts`). A top-leading question sits above the swatch; controls remain near the affected fabric, not at a disappearing bottom edge. Below **800px available width**, stack both worlds with the same scales; retain all functionality at **320px** and **200% zoom** (`layout.md › Adaptability`).

Translate `accessibility.md › Mobility` into **44×44 CSS-pixel** targets, **12px** separation, native buttons/range, visible **3px** focus ring, full keyboard operation, labeled per-job table, and polite result announcements. This is a chosen web target, not an assertion that CSS pixels equal Apple points. `charting-data.md › Designing effective charts` favors common charts; justify the novel mapping with a legend and Flat proof. `undo-and-redo.md › Best practices` gives “Undo quantum change”; group one continuous drag into one undo step, and never hijack text-field undo.

Each job is a ribbon: **x = model time, z = stable job row, y = cumulative waiting**. Service advances time without raising the ribbon; waiting advances time and raises it. Both worlds use identical scales. Geometry, not cloth physics, encodes the trace. One orthographic camera, matte material, no bloom, no refractive glass. Three.js/WebGL earns its place by making accumulated waiting spatial; reject it if Flat proof communicates better.

### Signature storyboard: introductory explanation, never functional latency

| Element | Role | Start | Duration | Motion / relationship |
| --- | --- | --- | --- | --- |
| Waiting geometry | Lead | 0ms | 700ms | Unfold from flat to cumulative-wait height; one whole-object gesture |
| Selected-job annotation | Support | 560ms | 140ms | Opacity only; overlaps the lead’s settlement |
| Camera, controls, axes, metric digits | Static | — | — | Remain readable and actionable; no count-up or child stagger |

`emil-design-eng/SKILL.md › Animation Decision Framework` and `animate/SKILL.md › Easing and duration`: **120ms** pointer press to `scale(.97)`; UI entrance curve **(.23,1,.32,1)**; explanatory morph curve **(.77,0,.175,1)** through CustomEase. `transform-origin:center` applies to the button; no popover is necessary. `choreograph/SKILL.md › Hard Rules`: one entrance per container, no blocked input, no uniform stagger. The **700ms exception is an explicitly requested introductory explanation**, not a transition on every simulation edit. Keyboard actions, slider tracking, selection, metrics, and repeated runs update at **0ms**. No springs: controls must not overshoot. Cut decorative tilt (`mass:1, stiffness:100, damping:10` from Emil); it teaches nothing.

`apple-design/SKILL.md › Direct manipulation`: range changes track 1:1, no debounce or delayed commit. `motion.md › Best practices`: cancel/re-target the live presentation on interruption. Reduced motion collapses to static explanatory frames or **140ms opacity-only**; no camera motion. GSAP `matchMedia().revert()` handles lifecycle cleanup; do not redundantly wrap its internal context.[19] Use BufferGeometry for ribbons; InstancedMesh only if many repeated markers warrant it, with `instanceMatrix.needsUpdate` and disposal.[20] [21] Cap DPR at **1.5**, target **≤40 draw calls** and **60fps** during the reveal, render on demand, pause hidden tabs. These are measured acceptance budgets, not verified performance. Reject ScrollTrigger, SplitText, and Flip: scrolling is not the lesson, labels must stay readable, and the layout need not travel.

## 6. Failure, security, and honest limits

| Failure/threat | Mitigation and boundary |
| --- | --- |
| Quantum 0, invalid jobs, boundary ties | Schema bounds, explicit tie rule, golden fixtures, service-conservation and no-overlap tests. |
| Frame rate changes the outcome | Simulate first; animation reads trace. Compare results with canvas disabled. |
| Beautiful geometry misleads | Shared axes, declared mapping, exact table; show long-job harm alongside mean improvement. |
| Imported JSON freezes or injects content | File/total-work limits, strict parsing, text rendering only; no eval, HTML, URLs, or executable plugins. |
| WebGL/context failure or low power | Flat proof remains fully usable; dispose resources; surface “3D unavailable,” not a spinner trap. |
| Export leaks personal notes | Memory-only by default; preview export fields; no names/notes in share URLs. Local execution cannot protect against a compromised browser. |
| Toy result becomes a prescription | Persistent “One machine; finite jobs; switching cost 0” label. No real-time performance or universal fairness claim. |

`privacy.md › Best practices`: process locally and request only necessary data. There are no microphone, file-system-wide, account, or AI permissions. Self-host assets; disclose ordinary hosting requests/logs rather than promising “zero network.”

## 7. Build plan and demo

Apply `build-principles` and `poteto-agent-code-quality`: make invalid states hard to express, then types/tests, then runtime proof, then prose/human judgment. Do not parallelize implementation before a reliable verifier exists.

| Slice | Minutes | Proof check |
| --- | --- | --- |
| 1. Pure kernel and contract | 15 | Failing golden fixture first; exact 48-work conservation, no early service/overlap; quantum-boundary test. |
| 2. Prediction/run/compare/reset in SVG | 20 | Complete keyboard-only loop; calculated 7/4.5 and 13/15 outputs. **Working loop at 35.** |
| 3. Follow thread, quantum, undo | 15 | Selection persists across worlds; cancel/undo restores input and trace; first-service versus completion labels checked. |
| 4. WebGL swatch | 30 | Geometry sampled against trace; canvas-off parity; actual frame/draw-call budget and context-loss fallback. |
| 5. One explanation timeline | 20 | Retrigger at 350ms; keyboard/reduced-motion bypass; no stale timelines after resize/unmount. |
| 6. Export and hardening | 20 | Round-trip recomputation, invalid/oversized imports, typecheck/build, 200% zoom and compact layout. |
| 7. Freeze and demonstrate | 15 | Fresh launch, complete loop, GPU failure path, checkpoint receipt; no risky additions. |

**90 seconds:** 0–10: state the question and prediction. 10–25: run FIFO, follow one short job. 25–40: share the machine and unfold waiting. 40–55: select the long job; expose **13→15 despite 7→4.5**. 55–70: adjust quantum, undo, show Flat proof. 70–80: export/recompute, state toy assumptions. 80–90: show one failed-then-passing boundary test and the scoped Studio build record.

## 8. Manus leverage

**Parent-only:** `webdev-mcp` after the Local First hosting choice and a fresh isolated project; declare diagnostics, `runtime/dev-commands`, `/manus-routes.json`, and confirm Managed Git checkpoint recording. Do not initialize during analysis or mistake a local Git commit for a saved Manus version. Cascade builds thin slices with the fixture and invariants in context. `desktop-in-app-browser` verifies the real loop, keyboard, interruptions, and fallback; this subagent did not do that.

**Parent-only:** `video-editor` imports actual screen capture, adds the 15-second captions on an editable timeline, then exports; never generate a reenactment of working UI. Use its skill and optional Alchemy for direction, not correctness. `slides` is optional for one model-assumption explanation after the loop. Do not force Game Dev, image generation, automations, a paid Cloud Computer, or runtime AI into a deterministic teaching instrument. Required Emil/Apple skills guide slice 5; build-principles/poteto guide all slices. A narrow read-only reviewer can check trace/renderer parity after tests work; orchestration belongs to the parent.

## 9. Socratic probe set

| Subskill | Level-5 mastery descriptor |
| --- | --- |
| Originality and selection | Names direct comparators, distinguishes algorithm novelty from interaction originality, and changes ranking when evidence changes. |
| Scheduling semantics | Implements FIFO/RR with idle gaps, boundary arrivals, interruption, and explicit deterministic tie-breaking. |
| Measurement honesty | Separates first-service delay, completion latency, waiting, and service; explains why a better mean can hurt a subgroup. |
| Visual encoding | Reconstructs an individual trace from geometry, checks common scales, and supplies an equivalent nonvisual/flat route. |
| Motion engineering | Separates truth from presentation, cancels live timelines, and verifies keyboard/reduced-motion behavior without losing meaning. |
| Agent verification | Turns repeated mistakes into API/type/property constraints and reproduces a real runtime defect before fixing it. |
| Scope and privacy | Ships the loop before spectacle, validates local exports, and states toy-model and hosting limits without inflated claims. |

**Diagnostics, easy→hard:** (1) What does one blue versus hollow interval mean? (2) How can mean completion improve while some jobs worsen? (3) What happens when a job arrives exactly at a slice boundary? (4) How would you prove the WebGL reveal did not alter the scheduler’s result?

**Adversarial:** (5) Add switching overhead: under what conditions can your “sharing helps” lesson reverse? (6) A grader says “a Gantt chart with shaders”; demonstrate the product difference without mentioning aesthetics.

## 10. Open questions, confidence, and final call

Ask Wilson only: **Does “Who paid for faster?” feel like his own question? Is the available build window at least 135 minutes? Does he prefer a teaching instrument over a puzzle game?** Confidence: **high** in the deterministic core and safety boundary; **medium** in the short-window visual execution and novelty; **unknown** in authentic personal ownership.

**Devil’s advocate:** This is an existing scheduling simulator dressed as fabric, with a curated fixture manufacturing a dramatic lesson. Answer: disclose the fixture, preserve every job, reveal the harmed subgroup, and invite quantum changes rather than declare a winner. If a newcomer cannot explain one job’s trade-off after 30 seconds, the novelty is superficial: cut the sculpture or switch to LIGHTFOLD.

**Final call:** Build WAITWEAVE. Cut runtime AI, cloth physics, additional policies, cloud persistence, scroll choreography, and the second lesson. Start with **kernel → complete SVG loop → follow-thread/undo**, then earn the single WebGL reveal with correct evidence.

## Opened-source index

[1]–[10], [17], [18]: linked at point of use above. Additional opened URLs:

[11] <https://github.com/trending> · [12] <https://news.ycombinator.com/shownew> · [13] <https://gsap.com/showcase/> · [14] <https://tympanus.net/codrops/hub/author/gsap/> · [15] <https://threejs.org/> · [16] <https://explorableillusions.com/simulations/braess-paradox/>

[19] <https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>; <https://gsap.com/docs/v3/GSAP/gsap.context()/>; <https://gsap.com/docs/v3/GSAP/Timeline/>; CustomEase source: <https://raw.githubusercontent.com/greensock/GSAP/master/src/CustomEase.js> (docs page was challenged).

[20] <https://threejs.org/docs/pages/BufferGeometry.html>; <https://threejs.org/docs/pages/WebGLRenderer.html>. [21] <https://raw.githubusercontent.com/mrdoob/three.js/dev/src/objects/InstancedMesh.js> (official source used because docs extraction was navigation-heavy).

Conceptual grounding: Dean and Barroso, [The Tail at Scale](https://cacm.acm.org/research/the-tail-at-scale/), 2013, explicitly discusses head-of-line blocking and time slicing. It supports the mechanism, not the toy model’s numerical results or an assertion that round robin is universally preferable.
