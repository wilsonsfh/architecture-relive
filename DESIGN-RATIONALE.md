# Problem 7 Design Rationale (ideation stage, no build started)

Written 2026-11-25 by the standalone Problem 7 session. Nothing has been built. Anything I cannot verify from my own history is marked **unknown**.

## 1. Decisions so far

**Status: no idea is final.** Wilson wants to think about Q7 himself. Two candidates are on the table, plus one option from the coordinator.

### Candidate A: Song finder (text-to-song)
- Wilson's original idea: describe fragments (lyrics, mood, where you heard it) in text, and the AI helps find the song. Text only, no audio input.
- Reasoning for keeping it text-only: audio/humming input would overlap Problem 1 (voice input). A guessing-game format would overlap Problem 2 (multiplayer). A plain "type what you want" box would overlap Problem 4.
- Evidence gathered that the problem is real:
  - Google Hum to Search exists but fails for some users (for example unsupported phone language, per a 2026 troubleshooting guide). 
  - Kugou claims 90%+ humming accuracy for decent singers. This is a company claim, not an independent test.
  - A Spotify research paper (Bhargav et al., 2023) on tip-of-the-tongue music queries found that "uncertainty" was the most common label in 100 annotated posts (162 uses), and that users often list songs they have already ruled out.
- Wilson's claim that Shazam lacks many Chinese songs: **unknown / not verified.** I did not find a source and left it out of conclusions.
- Planned differentiator: a "memory board" where each clue has a confidence state (sure, unsure, ruled out), and the candidate list updates live. Candidates would be checked against a real catalog (iTunes Search or MusicBrainz) so the model cannot invent songs. **This was a proposal, not a decision.**
- Proposed identity (not confirmed by Wilson): warm analogue look (cream paper, wine red, tobacco brown, serif type), chosen to stay away from the identities taken by problems 1 to 6.

### Candidate B: Architecture appreciation and history playback
- Wilson's second idea: compare architectural styles (Romanesque, Gothic, Baroque), map each to modern buildings carrying the same idea, and use video generation to replay a historical moment that inspired the style or that a revival style imitated. Inspired by a hackathon project that recognises an instrument from a photo and plays its sound.
- My assessment: stronger fit for the open slot in the coordinator digest ("human-centred creative/learning product"). Photo-to-style apps already exist, so recognition alone is not the differentiator. The combination of side-by-side style comparison, a modern-building link, and a history scene was not found in my search. That is a limited search and not proof nobody has built it.
- Risks noted: generated video can show wrong clothing, tools or buildings; styles are often mixed so the product should say so; the modern-building mapping needs a curated source; images need open licences (for example Wikimedia Commons) with credit; avoid overlap with Problem 8 (promo video).
- My lean: B is the stronger idea; A is a viable second option. **Wilson has not decided.**

### Candidate C: WAITWEAVE (from the coordinator's analyst, not mine)
- Scheduling visualisation (first-come-first-served versus round-robin). I did not analyse it. I only repeated the coordinator's summary. Its score (4.50 of 5 against 11 candidates) comes from that analyst's report, which I have not read: **unknown.**

### Open Socratic questions to Wilson (unanswered)
1. For the song finder: what do you change when Google fails on the next attempt?
2. For architecture: what is the one moment in the first 10 seconds that makes a reviewer say "I get Gothic now"?

## 2. Tools available to me in this session
Listed from my tool definitions: read, write, edit, exec (shell), search (web, news, image, scholar), fetch, mcp, job, ask.
MCP servers listed as available: exa, manus-device, manus-tools (media generation), desktop-in-app-browser, kkday, slides, handoff, manus-tasks, triggers, trip, video-editor, webdev-mcp, workflow.
Skills listed as available include: deep-research, imagegen, slides, webdev, video-generation, video-editor, music-prompter, tts-prompter, workflow-composer, and others. Local reference skills in `_reference/`: Jane Street socratic-tutor, apple-design-skill, and an Emil Kowalski-style `skills` collection.

## 3. Tool calls I actually made (from this conversation)
- `exec` (shell): list workspace and `_reference`; read file counts; verify my skill file; check the destination folder for this document; compare two coordinator feeds with `diff` and `grep`.
- `read`: Jane Street `socratic-tutor/SKILL.md`; the pasted problem list; the pasted coordinator digest; two coordinator progress feeds; the `deep-research` skill file.
- `write`: `skill-adapted/socratic-build-coach/SKILL.md`; this document.
- `search`: web search for lyric-search prior art; Shazam and humming support; Chinese music app humming recognition; scholar search for tip-of-the-tongue music retrieval; web search for architecture-style recognition apps and the instrument hackathon pattern.
- `fetch`: the Spotify tip-of-the-tongue paper (arXiv 2305.14072).

## 4. MCPs and skills actually used
- **MCPs used: none.** I did not call the `mcp` tool. The exa, slides, webdev-mcp, video-editor and manus-tools servers were available and unused.
- **Skills actually read:** `deep-research` (read before searching, as it requires) and the local Jane Street `socratic-tutor`.
- **Skills I did not read or apply:** imagegen, slides, webdev, video skills, music-prompter, and others.
- **Workflow/subagents:** I did not start any agents or workflows. Earlier in this conversation, a coordinator-side summary mentioned many agents; those were not mine.

## 5. Code mode
**No.** I did not use a code-execution loop in a code-mode sense. I used ordinary single tool calls, plus a few short shell commands.

## 6. Websites referred to
- Google blog on Hum to Search: blog.google/products-and-platforms/products/search/hum-to-search/
- Search result pages and sites (snippets or page content): chosic.com lyric finder; findmusicbylyrics.com; soundcatch.app (Hum to Search not working guide, 2026); kuku.baidu.com humming guide (Kugou claim); news.qq.com 2020 recognition test; chiphell.com forum thread (2025).
- Research: arXiv 2305.14072 (Spotify, tip-of-the-tongue for music), opened and read in part.
- Architecture search results (snippets only, not opened): facade-recognizer.com, thearchieapp.com, App Store ArchitectureScan, vestigia-ai.com, lablab.ai "Play It" page.
- Social links in the original brief (an Instagram reel): **I did not open it.** I cannot say what it contains.

## 7. Honest yes/no on specific inspirations
- **Inspora:** **No.** I did not use it and have no information about it. I do not know what it is, and nothing I did refers to it.
- **Apple design skill:** **No, not applied.** It exists in `_reference/apple-design-skill` and `_reference/skills/skills/apple-design`, but I did not open or follow it. Any warm-look suggestions I made were my own reasoning, not derived from it.
- **Emil Kowalski's skills:** **No, not applied.** They exist under `_reference/skills`, but I did not read them. I mentioned "fast, under 300ms, spring easing" from general memory of his public guidance. That is unverified against the files and should be treated as a recollection.
- **Socratic tutor (Jane Street):** **Yes**, read in full and adapted into `skill-adapted/socratic-build-coach/SKILL.md`. I have asked Wilson only questions in that style so far, and they remain unanswered. I have not yet run a skill-map diagnostic or rendered a skill map.

## 8. Known weaknesses of my earlier work
- One earlier claim, "no tool narrows down vague clues", was not backed by a search of tools like that. I only searched lyric and hum tools. Treat it as unverified.
- The song-finder identity proposal (wine red, cream paper) was never tested against a design reference.
- I did not read the coordinator's `analysis/p7-bring-your-own-idea.md` or `00-digest-all-problems.md`. I only saw pasted excerpts.


## 9. Update 2026-11-25 21:52: Wilson's direction (decision)
Wilson confirmed the architecture idea as the lead for Problem 7. His stated reasoning, in my paraphrase:
- The strongest feature is the history playback, because it creates appreciation.
- Busy people rarely look at older buildings, since skyscrapers overshadow them. They mostly see them when travelling. The product should make people want to travel to see these buildings.
- Appreciation needs vocabulary, so the product must name the style with correct terms and facts.
- It should be interactive: click into a building and go inside it. He asked for Three.js or similar 3D tools.

Status of the song finder: set aside, not deleted. It remains a fallback.
Still **unknown**: which three styles, whether the instrument-sound pattern is included, and how much 3D can be done in the time available.


## 10. Update 2026-11-25 21:58: simplified product definition (supersedes the travel-funnel framing in section 9)
Wilson clarified that the "busy office worker" scenario was only an example. He does not want a use-case funnel. Section 9's motivation to travel stays as background, not as a feature to build or measure.

**Core loop (decision from Wilson):** get or generate an architecture, see what it is, then either (a) explore its storyline (history playback) or (b) view its interior.

**Four ways in (decision from Wilson):**
1. **Generate.** AI image generation of a building, including a real, existing one.
2. **Random.** A "show me a random architecture now" button that picks a real building and leads into the storyline or the interior.
3. **Photo.** Take or upload a picture; a preset AI model identifies it and generates the storyline.
4. **Video.** Upload a video; the system combines details across frames into a storyline. The mode is called "Make your own storyline".

**Why the guardrails matter most here:** every way in risks the same failure, which is a confident, wrong or invented building or fact. The product teaches facts, so one visible error undermines the whole idea. The design therefore treats "what do we know for sure" as the first question, before any generation.

**Where I am unsure (unknown):** whether Wikidata and Wikipedia coverage is good enough for the buildings Wilson will want. I have not queried either. The guardrail design in the technical breakdown depends on that.

## 11. Tool-record correction for this session
Since the first version of this document, I also made these calls: `write` (appends to this file and `TECHNICAL-BREAKDOWN.md`), `read` (this file), and `exec` (file-length checks). I still used no MCPs and no sub-agents. The earlier "interrupted" command (a diff of the coordinator feed) did not finish, so I never confirmed that feed's contents.

## 12. Build record 2026-11-25 22:19: design skills now read and applied

I read the Emil Kowalski `emil-design-eng` skill and the `apple-design` skill from `_reference/`. This changes the earlier "no" for those two (Inspora is still "no"). I did not open the Apple HIG reference pages, so I cite only the skill's own lenses, not individual HIG pages.

Applied to `public/css/style.css`. These were checked by reading the code, not by looking at a rendered page.

| Change | Source of the rule |
|---|---|
| Easing set to `cubic-bezier(.23, 1, .32, 1)`; button transitions 160 ms; no `transition: all` | Emil: strong ease-out, 100-160 ms press feedback |
| `:active` scale(.97) on every button | Emil: pressable elements must respond |
| Hover effects only under `(hover: hover) and (pointer: fine)` | Emil: touch devices fire false hovers |
| Small text (footer, sources, source line) moved to `--ink-2` (#5A4F44 on #EDE6D6). I expect it to clear 4.5:1 but have not computed it | Apple Lens 1: contrast |
| Back and Play/Pause controls given larger tap padding | Apple Lens 1: control size |

Still open: the Apple "remove one accessory" pass, a contrast calculation with real values, and everything that needs a rendered page (hotspot framings, layout, WebGL, transitions).

Test status: 7 of 8 node tests pass. Test 8 (server path traversal) failed with `listen EPERM 127.0.0.1`, because the execution policy now blocks binding a loopback port from the test runner. Curl to :4817 was also denied this turn, so I could not re-check the resident server. Both are policy limits, not code findings. The earlier passing run is the last evidence for that test.

## 13. Wilson's reaction and what is changing (22:20 to 22:30)

Wilson opened the running prototype and said, in his words, "The Gothic is very good. Really, really good." He singled out the fonts, the colour, the landing page, the button sizes and the animation. This is his reaction to the first version, before the changes below. I have not seen the page render myself; this is his report.

His requested changes, in his priority order, and their status at 22:30:

| Request | Status |
|---|---|
| Rename to "Architecture Magic" | Page title done. The hub card name ("4817") belongs to the hub session, not to this app |
| Any building, not only 4 cathedrals ("Great Wall of China" was refused) | Built: server resolver using Wikipedia and Wikidata, optional model for captions, photo licence check. Tested keyless on the Great Wall (6 scenes, 6 photos) and on "Hogwarts castle" (refused). Not yet tested in the browser, and not yet tested with a model |
| 15 to 20 presets across styles and regions | In progress: 30 titles queued, resolved through the same guarded pipeline. Result count recorded in `public/data/presets.json` |
| Working play, pause, back, forward, close | Rewritten with one state machine plus Esc and arrow keys. Not yet clicked in a browser |
| Real photos beside the illustrations | Built for every scene: openly licensed Commons photos with credit, labelled "Photo today, not of this moment" because no photo is matched to a specific historical moment |
| 3D: surroundings and more realistic stone | Procedural sky, ground, town and ashlar/flagstone textures with bump maps (`public/js/env.js`). Never rendered by me; the look is UNKNOWN |

## 14. Reusable design system

This is exactly what is in the code today (`public/css/style.css`, `public/js/app.js`). Where I have not seen it rendered I say so. Nothing here was copied from another project.

**Palette tokens (CSS variables).** `--stone #EDE6D6` (page), `--stone-2 #E2D9C4` (cards, plates), `--ink #1B1612` (text, primary button), `--ink-2 #5A4F44` (secondary text), `--ruby #9B2D30` (the one accent: links on hover, progress, markers), `--amber #C98F2B` (quote rule, small labels on dark), `--moss #4B6B55` (the green "verified" dot), `--night #15110E` (interior background). One accent rule: ruby means "active or emphasised". Contrast of `--ink-2` on `--stone` has not been computed with a tool.

**Type.** Body and controls: system SF stack `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui`. Display: `ui-serif` ("New York" on Apple devices, falling back to Iowan Old Style or Georgia), weight 500, letter-spacing -0.03 to -0.035em, line-height about 1. Sizes are fluid with `clamp(min, vw, max)`:

| Role | Size |
|---|---|
| Home headline | `clamp(56px, 11vw, 168px)` |
| Building name | `clamp(44px, 6.4vw, 104px)` |
| Scene title | `clamp(40px, 5.6vw, 88px)` |
| Term in the interior | `clamp(40px, 5.6vw, 84px)` |
| Subline and body | `clamp(20px, 2.1-2.4vw, 30-32px)` |
| Buttons | `clamp(20px, 2.2vw, 28px)`, weight 600 |
| Small print (credits, sources) | 12 to 14px |

Caveat is installed and vendored under `public/vendor/fonts/` but is NOT used yet.

**Buttons.** Primary: pill (`border-radius: 999px`), ink fill, stone text, padding `.8em 1.4em`. Secondary: transparent with a 2.5px inset ink ring. Tertiary: underlined text. Story controls have `min-height: 44px`. Few buttons per screen: the result screen has two primary actions and one text link.

**Motion.** Easing `--ease: cubic-bezier(.23, 1, .32, 1)` (Emil's strong ease-out). Press: `button { transition: transform 160ms var(--ease) }` and `button:active { transform: scale(.97) }`. Hover (only under `@media (hover: hover) and (pointer: fine)`): primary button turns ruby and lifts 2px. Colour transitions 200ms. GSAP: headline words rise with `yPercent: 110`, `0.7s expo.out`, `0.06s` stagger; supporting items rise `y: 18`, `0.6s power3.out`, `0.08s` stagger, starting after the headline. Screen change: old fades out `0.25s power2.in`, new fades in `0.3s`. Scene change: `y: ±24`, `0.6s expo.out`, `0.07s` stagger. Interior camera moves: `1.5s power3.inOut`. Scene timer is a linear 7s progress bar. `prefers-reduced-motion` skips the GSAP movement and shows drawings immediately. Rule from Emil applied: no animation on keyboard actions is NOT yet applied (arrow-key scene changes still animate); that is a known gap.

**Layout.** Screens use `padding: clamp(24px, 5vw, 72px)`. Result is a two-column grid (photo 1.1fr, info 1fr) with `gap: clamp(24px, 4vw, 64px)`; below 820px it becomes one column and the photo shrinks to 4:3, 40vh. Photo cards and plates have 28px radius. Mobile layout has not been tested on a device.

**SVG plate technique.** Each plate is a function returning an inline `<svg viewBox="0 0 400 300">` of stroked paths (round caps and joins, 2.4px, ink colour with ruby/amber/moss accents). Helpers: `pointedArch`, `roundArch`, `ground`. Every path has class `draw` with `stroke-dasharray: 1000; stroke-dashoffset: 1000`, and GSAP animates `strokeDashoffset` to 0 (1.4s, `power2.inOut`, 0.18s stagger) so the drawing "writes itself". This is plain geometry, not yet hand-drawn: the wobbly-ink, watercolour wash and hatching pass requested at 22:19 is NOT done.

**Honesty UI.** Every claim carries a state: green dot for verified, "Illustration, not a reconstruction" on plates, "Photo today, not of this moment" on photos, "Simplified model... Not a scan" on the 3D view, and a "Source line" disclosure with the verbatim quote.

**Emil and Apple rules applied, and where.** Emil: strong ease-out and 160ms press scale (global `button` rules), hover gating, stagger of 60 to 80ms (`popWords`, `rise`), asymmetric timing (fade-out 0.25s shorter than fade-in), reduced motion. Apple (from the skill's own lenses, not the HIG pages): contrast moved to `--ink-2`, 44px minimum control height on story controls, one accent colour, visible `:focus-visible` ring (3px ruby), plain labels that name the action ("Its story", "Step inside"). Not applied: Apple's text-size scaling check and a measured contrast table.

## Update 23:30: three-pane story, walk-through, capture mode
Rule from Wilson (23:29): these markdown files are suggestions; his chat directives win on any conflict.
- Each story step shows three panes: procedural line storyboard (cream #F6F1E4, 1.3 px black strokes, red #C23B2E accents, `.draw` stroke animation, small `sb-*` living loops), an AI image, and an AI clip. AI media is always labelled "AI-generated"; no text is baked into images; captions are HTML.
- Where no AI image exists, a per-scene CC photo or the lead photo is shown, labelled "not of this moment".
- Interior: "Walk through" runs a 7-stop GSAP fly-through of the simplified nave. Capture mode (`?capture=1` or key C) hides all controls and debug text for promo recording; a small "simplified model" label remains.
- Likeness guardrail: generic anonymous people only, no named real people, all AI media labelled. See LIKENESS-GUARDRAIL-NOTES.md.
- Honest status: the three-pane story, tour and capture mode are code-checked only; browser QA was requested via the Coordinator.

## Update 23:45: storyboard animation, building-specific line art, capture
Driven by Wilson's chat (23:33 "graphics must reflect the project", 23:39 "the storyline must truly animate").
- Each step is one 7 s GSAP timeline that Play, Pause, Back and Next control: sky and ground draw (0-1 s), year and building name are hand-lettered in Caveat (0.5-1.6 s), the building draws stroke by stroke (0.9-3 s), the action from the scene text rises in and draws (3-5.5 s), and a red label names it. Small CSS loops (crane hook, flames, flag, walkers, clouds, birds) freeze on Pause.
- Line art is specific to the building: 11 buildings have their own silhouette (Notre-Dame, Chartres, Cologne, Sagrada Familia, Chrysler, Sydney Opera House, Forbidden City, Golden Temple, Angkor Wat, St Basil's, Pisa). The rest use 5 style-based elevations.
- Honest limits: the actions are picked by keywords, the third pane is a labelled "Animated still" pan where no clip exists, and the silhouettes are rough sketches that have not been checked against photos.
- Capture mode (`?capture=1` or C) hides controls on the story and interior screens. The AI and model labels stay.
- QA fixes from 23:40: "Romanesque" no longer draws a temple, mobile badge and pin overlap, capture term overlap, and the pan now pauses.
