# Architecture Relive / Q7 Nave — v2238 QA

Read-only check, 2026-11-25, approximately 22:43–22:52 +08:00. Chromium via Python Playwright, light color scheme, 1440×900 and 390×844. No app files changed. Server on port 5817 remains running (HTTP 200); both QA browsers closed.

## Views and controls
| View / check | Result | Screenshot(s) in `shots/` |
|---|---|---|
| Home, both widths | PASS: visible layout; named Great Wall search opens its result. | `01-home-1440.png`, `02-home-390.png` |
| Great Wall result, both widths | PASS: photo, facts, sources and story action visible. Non-Gothic inside action correctly absent. | `03-great-wall-result-1440.png`, `04-great-wall-result-390.png` |
| Great Wall story, desktop | Open PASS; Play PASS; Pause PASS; Next PASS; Back PASS; Close PASS. | `05-great-wall-story-scene1-1440.png`, `06-great-wall-story-playing-1440.png`, `07-great-wall-story-scene2-1440.png` |
| Great Wall story, mobile scene 1 | FAIL visual layout: illustration/photo squeezed into tiny tiles; captions obscure artwork. | `08-great-wall-story-scene1-390.png` |
| Chartres inside start, desktop | Loads, but overexposed; pale overlay text is difficult to read. | `09-chartres-inside-start-1440.png` |
| Chartres inside start, mobile | FAIL: Back covered; pins clipped/covered; overexposed. Fresh navigation, initial Nave term. | `11-chartres-inside-start-390.png` |
| Chartres Pointed arch pin, desktop | Open PASS: term changes. Label-visibility PASS: entire label in viewport and center unobstructed. | `10-chartres-inside-pin-1440.png` |

Story starts playing automatically, so it was paused/reset before pressing Play. Over ~2 seconds, scene 1 progress advanced from 0 to 0.2857. After Pause, index 0 and progress 0.3119 remained unchanged for 2 seconds. Next changed index 0→1 / Overview→Early walls; Back restored index 0 / Overview. Close removed the story and returned to the Great Wall result. All six Great Wall and six Chartres scene selectors were also visited for the SVG recheck.

## Defects, ordered by severity
| Severity | View | Observed defect | Screenshot evidence |
|---|---|---|---|
| HIGH | Chartres inside, 390 | Model disclaimer covers the Back label and intercepts its center/text hit target. Back bounds: x8/y8, 257×44; disclaimer: x0/y18, 370×54. | `11-chartres-inside-start-390.png` |
| MEDIUM | Chartres inside, both | Large white/yellow washed-out surfaces lose detail; pale definition/source text and disclaimer have poor visual contrast over the model. | `09-chartres-inside-start-1440.png`, `10-chartres-inside-pin-1440.png`, `11-chartres-inside-start-390.png` |
| MEDIUM | Chartres inside, 390 | Flying buttress and Triforium text extend beyond the right edge; Clerestory pill crosses the left edge. Rib vault is under the disclaimer; Nave center/text is covered by the term source paragraph. Desktop opened Pointed arch label is not clipped. | `11-chartres-inside-start-390.png` |
| MEDIUM | Great Wall story, 390 | Two-column stage leaves the photo and illustration about 70px tall; illustration disclaimer overlaps the drawing and photo attribution obscures most of the tiny photo. | `08-great-wall-story-scene1-390.png` |
| MEDIUM | Inside / story, both | Measured pin buttons remain 38px tall; scene-selector buttons remain 44×24px, below the requested 44px height. Main desktop story controls are 48px tall. | `08-great-wall-story-scene1-390.png`, `10-chartres-inside-pin-1440.png` |
| MEDIUM | Great Wall / Chartres stories | Eight SVG path-data console errors across the run. Great Wall scene 4 contains `d="MM180 145…"`; its arch path is invalid. The duplicated `M` remains in `plates.js` templates. | `12-great-wall-story-svg-error-1440.png`; `console.json` |
| MEDIUM | Great Wall story, scene 4 | Timeline heading displays “540”, while its caption uses “540 m” as a distance, not a dated event. This is an observed heading/caption mismatch, not an external historical fact check. | `12-great-wall-story-svg-error-1440.png` |
| LOW | Initial page loads | `/favicon.ico` returns 404; two browser console occurrences across the two runs. No other HTTP failure observed. | `01-home-1440.png` (page context only); `console.json` is the actual error evidence |

## 22:23 build recheck
| Older defect | Status | Current evidence |
|---|---|---|
| (a) Mobile disclaimer overlaps inside Back | STILL PRESENT | Fresh 390 start: disclaimer covers text and center hit target. |
| (b) Pin labels clip or are covered | STILL PRESENT | Mobile right-edge clipping and Rib vault/Nave overlay coverage; desktop Pointed arch label passes. |
| (c) Inside model overexposed | STILL PRESENT | White/yellow washed-out surfaces at both widths. |
| (d) ~24 duplicated-M SVG console errors | STILL PRESENT | Same `MM…` error reproduced; eight occurrences here, not a claim of the old count. |
| (e) Console 404 | STILL PRESENT | Exact URL: `http://127.0.0.1:5817/favicon.ico`. |
| (f) 38px pins / 24px scene selectors | STILL PRESENT | DOM bounding-box measurements match both heights. |

## Console / network
`console.json` contains all captured console warnings/errors, page errors and failed requests, with URLs. Totals: **10 console errors** (8 SVG, 2 favicon), **8 warnings** (WebGL GPU stall / ReadPixels), **0 page errors**, **0 request-failed events**. The favicon is the only verified HTTP ≥400 URL. Native favicon requests did not appear in Playwright response events, so the already-observed 404 was verified with a read-only HTTP request and recorded explicitly. GPU warnings are retained, not treated as an app defect.

## Not verified
- OpenRouter/LLM generation and live model-assisted lookup: no key available; expected disabled functionality, **not a defect**. Great Wall used its ready/cached record.
- Automatic seven-second scene changes, complete autoplay, final-scene Replay, and pause periods longer than the measured two seconds.
- Every inside pin's focus destination, complete camera-flight behavior, drag/zoom, keyboard shortcuts, or physical touchscreen behavior; only desktop Pointed arch opening and label visibility were checked.
- External source/link availability, historical accuracy, quote fidelity and licensing; only the displayed scene-4 unit mismatch was flagged.
- Other buildings, browsers/devices, viewport sizes, dark/reduced-motion modes, sustained performance, and any error occurring outside this captured run.
