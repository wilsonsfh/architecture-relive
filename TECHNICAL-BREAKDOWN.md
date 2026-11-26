# Problem 7 Technical Breakdown: Architecture Appreciation and History Playback

**Status: everything below is PROPOSED. Nothing is built, installed or tested.** The leading idea is not confirmed by Wilson. Labels: PROPOSED = intended for the first build; DEFERRED = deliberately left out; UNKNOWN = I could not verify it.

## 1. The product in one paragraph (proposed)
The user picks or uploads a photo of a building. The product names the style (or says it is mixed), circles the features that give it away, places it next to one or two other styles for comparison, links it to a modern building that carries the same idea, and offers a short illustrated history scene explaining why the style exists. The tone is appreciation, not a quiz.

## 2. Components (proposed)
| Component | Job | Proposed approach |
|---|---|---|
| Web client | Photo input, comparison view, scene player | Single-page web app. Three.js or GSAP only where they serve the comparison or scene transitions |
| Style knowledge base | The source of truth for styles, features, example buildings, history scenes | A small curated JSON/SQLite set for 3 styles (Romanesque, Gothic, Baroque), written and checked by hand |
| Recogniser | Photo to style guess with confidence and feature list | A vision-capable LLM prompted with the fixed list of styles and features, returning structured JSON |
| Feature overlay | Circle the features on the photo | Model returns approximate regions; client draws them. Regions are advisory |
| Modern-building mapper | Style to modern building | Lookup in the curated knowledge base only. The model does not invent buildings |
| History scene player | Plays a short illustrated scene | Pre-generated clips or stills per style, with captions and sources |
| Image source layer | Photos for examples | Openly licensed images (Wikimedia Commons) with stored credit and licence |

## 3. Data flow (proposed)
1. User uploads a photo, or picks a built-in example.
2. Client resizes the image and strips location data (EXIF) before sending it.
3. Server sends the image and the fixed style list to the vision model.
4. Model returns JSON: top styles with confidence, visible features, uncertainty notes.
5. Server validates the JSON against a schema, and rejects any style or feature not in the knowledge base.
6. Server joins the result with curated content: comparison text, modern building, scene.
7. Client renders the result and the scene player.

If the model is unavailable, the built-in examples still work from stored results. That keeps the demo reliable (proposed).

## 4. Models and APIs (proposed)
- **Vision LLM** for style and features. Exact model: UNKNOWN until I read the built-in model catalogue (`builtin-llm-models` skill, not yet read).
- **Image or video generation** through the Client media tools for history scenes. Available as an MCP server in this session. Quality, cost and speed: UNKNOWN, not tested.
- **Wikimedia Commons API** for licensed images and credits. Not yet checked.
- **Wikipedia/Wikidata** for factual checks on buildings and dates. Not yet checked.
- No accounts and no database of user photos in v1 (proposed).

## 5. Risks and the proposed mitigation
| Risk | Why it matters | Proposed mitigation |
|---|---|---|
| Wrong style label | Many buildings mix styles | Show top two with confidence, and say "mixed" when appropriate |
| Generated history looks wrong | Clothes, tools or buildings can be inaccurate | Label scenes "illustrative"; prefer a few reviewed scenes over live generation; cite sources |
| Model invents buildings or facts | Breaks trust | Only show buildings from the curated list; schema-validate output |
| Slow or failed generation | Ruins a live demo | Pre-generate scenes; offline examples |
| Image rights | Legal and credit issues | Openly licensed images only; show credit and licence |
| User photo privacy | Photos may contain people, plates, location | Strip EXIF, do not store uploads by default, say so on screen |
| Similar apps exist | Weak differentiation | Lead with comparison plus modern link plus history, not recognition alone |
| Overlap with Problem 8 | The promo video also uses video tools | Keep in-product scenes short; make the promo separately |
| Prompt injection via text in photos | Signs or captions in an image could instruct the model | Treat model output as data, validate it, never act on text found in images |

## 6. Proposed for the first build vs deferred
**Proposed (first slice):** three styles; about six curated buildings; upload and built-in examples; structured recognition with confidence; side-by-side comparison; one modern link per style; one pre-made scene per style with captions; a deterministic test set that runs without the live model.

**Deferred:** live video generation; more styles (Byzantine, Renaissance, Art Deco, Brutalist); camera capture on mobile; maps or "buildings near me"; audio or music from each era (the instrument-hackathon idea); user accounts or saved collections; 3D walkthroughs.

## 7. How I would verify it (proposed)
- A fixed set of 12 to 15 labelled photos, run through the recogniser, with the accuracy reported honestly, including wrong cases.
- Schema tests that reject unknown styles or buildings.
- A check that every shown image has a stored credit.
- A manual review of each history scene for visible errors before it ships.

## 8. Work split and sub-agent note
Wilson's rule asks for asynchronous units to go to sub-agents, with a depth limit of three levels. In this documentation job I did not launch any, because it was one short document and I have no direct agent tool in this session. Candidate async units for a build, all PROPOSED: curated content research per style (one unit each), scene pre-generation, and the test-set labelling. I would route heavy work through the Coordinator, as instructed.

## 9. Open questions for Wilson
1. Is the architecture idea the final choice, or is the song finder still in play?
2. Which three styles come first?
3. Is the instrument-to-sound hackathon pattern wanted in the product, or only as inspiration?


## 10. Update: 3D "go inside" layer (all PROPOSED)
Wilson wants to click a building and see inside it, using Three.js or similar.

- **Approach (proposed):** do not build accurate models of real buildings. Build one hand-authored, procedural "archetype" per style in Three.js, such as a nave cross-section. Clicking a labelled feature (a pointed arch, a rib vault, a flying buttress, a barrel vault, a dome) moves the camera to it and shows the term, a plain definition, and why it exists.
- **Why archetypes:** photo-accurate 3D of a real cathedral is too large for the time available, and a wrong model would teach wrong facts. An honest "typical Gothic nave" is correct by construction. Label it as a simplified model, not a scan.
- **Camera and motion (proposed):** GSAP for camera moves between labelled features. Scene transitions kept short.
- **Playback link (proposed):** each feature can open a related history moment, for example the rib vault with the building-boom period behind it.
- **Alternatives (deferred):** licensed 3D scans or photogrammetry from open sources (licence and quality: UNKNOWN); AI image-to-3D generation (accuracy: UNKNOWN, likely unreliable for fact teaching).
- **Risks:** 3D scope can swallow the schedule, so the first slice is one style (Gothic) end to end, with the others added only if time allows. Mobile performance is untested.
- **Proposed build order:** (1) curated facts for one style; (2) 3D archetype with 5 to 6 clickable features; (3) recogniser and comparison; (4) history scene; (5) add the second and third styles.


## 11. Update 2026-11-25: core loop, four ways in, guardrails, first slice

### 11.1 Core loop (decided by Wilson)
Get or generate an architecture, see what it is, then choose the storyline (history playback) or the interior view. The travel-funnel scenario was only an example and is not a feature.

### 11.2 Four ways in
| Way in | Status | Truth source |
|---|---|---|
| Random ("Show me one") | BUILT, not browser-tested | Verified record |
| Type a name | BUILT (resolves only against the verified set), not browser-tested | Verified record, else "can't confirm" |
| Photo upload, preset model | PROPOSED, not built | Model guess accepted only if it matches a verified record |
| Generate (image generation) | PROPOSED, not built. No paid generation without Wilson's approval | Verified record, else labelled illustration |
| Video: "Make your own storyline" | PROPOSED, not built | Verified record plus frame observations |

### 11.3 Guardrail design
Each field on a building record has a status. The data build and the UI both enforce it.

| Status | Meaning | Where it appears now |
|---|---|---|
| VERIFIED | Matches Wikidata or Wikipedia, retrieved 2026-11-25 | QID, coordinates, style, start year, construction quote, feature quotes, image licence and credit |
| CURATED | Written by us; each line must carry a verbatim source quote | Scene titles and captions. `scripts/build-data.mjs` refuses to build if a quote is missing from the stored Wikipedia intro |
| ILLUSTRATIVE | Diagram, not a reconstruction | All storyline plates, labelled "Illustration, not a reconstruction" |
| GENERAL | A general Gothic idea not confirmed for this building | Interior features not named in that building's source, shown as "the source I checked does not mention it for [building]" |
| UNKNOWN | No source | Omitted, never guessed |

Refusal behaviour that is built: an unknown name returns "I can't confirm a building called X" plus the closest verified buildings; an ambiguous name asks which one; names under three letters are rejected; text is escaped before display. The 3D interior is always labelled "Simplified model of a typical Gothic nave. Not a scan, not [building]'s actual interior."

Not built yet: the photo-confidence thresholds, the "mixed or unclear" display, frame-consistency checks for video, and prompt-injection handling for model output. These are needed before any model is added.

### 11.4 What exists (built vs verified)
- BUILT and tested without a browser (8 passing node tests): data pipeline, verbatim-quote guardrail, name resolution, feature attestation, random pick, nave geometry (more than 150 meshes, every hotspot has geometry), server path-traversal blocking and CSP.
- BUILT but NOT tested in a browser: home, result, storyline player, interior view with GSAP camera moves, pin projection, transitions. I have not seen it render. WebGL behaviour and the camera framings are UNKNOWN until sandbox screenshots exist.
- Four verified cathedrals: Chartres, Notre-Dame de Paris, Cologne, Amiens. 21 scenes in total.
- Served on http://127.0.0.1:4817 (plain local, no Client-managed services).

### 11.5 Next slices (proposed order)
1. Fix whatever sandbox screenshots show.
2. Photo mode through OpenRouter, server-side only, key from the environment, timeout plus retry plus fallback model, schema-validated output, refusal when unsure.
3. Generation (needs Wilson's approval for any spend).
4. Video "Make your own storyline".

### 11.6 Questions for Wilson
1. Should the first thing a viewer sees be the random button (as built now) or photo upload?
2. Is a clearly labelled simplified interior acceptable instead of each real building's actual interior?

## 12. Update 23:30
- Resolver (lib/resolve.mjs): Wikipedia, Wikidata and Commons; year regex ignores numbers followed by units; scene-photo lookup has a name-only fallback; total misses are not cached.
- Generated media: public/cache/gen/<id>-s<i>.jpg and .mp4 (10 images, 10 clips, minimax-h3 5 s 768p, no audio), served same-origin (CSP media-src 'self').
- public/js/storyboard.js: `storyboard(scene, b)` builds a line SVG from the building type and scene keywords.
- Models via env: AM_CAPTION_MODELS, AM_VISION_MODELS; key from OPENROUTER_API_KEY, server-side only; deterministic path without a key.
- Fly-through: nave.js `TOUR` (7 stops) chained in app.js inside() with GSAP; stops on user drag. Capture mode: body.capture class.
- Not done: 360 panorama; browser-verified QA.

## 13. Update 23:45
- storyboard.js returns layered SVG groups `.sb-sky`, `.sb-ground`, `.sb-bld`, `.sb-act`, `.sb-labels` (labels in `.sb-lbl`, action labels in `.act`). app.js story() builds one master timeline per step over those layers. The progress bar follows `tl.progress()`. `.story.paused` sets the CSS loops to `animation-play-state: paused`.
- `BYID` maps building id to a silhouette function. Then regex fallbacks apply, with `\broman\b` so "Romanesque" is excluded.
- Sandbox QA v2315 (build lead, 23:40): partial pass. Story controls passed at 1440 and 390 for Notre-Dame, Chartres and Great Wall, and so did the walk-through and capture. That run did not cover the 23:45 changes.
- Run with `npm install`, then `node server.mjs`. The bundle is /tmp/am-p7-2345.zip.
