# Nave / Architecture Relive — browser QA

**Baseline:** the version transferred at 22:23 +08 on 25 November 2026. **Capture:** 22:30:16–22:33:10 +08. QA only; no application fixes. All **48 application files are byte-for-byte unchanged**, confirmed by SHA-256 before/after comparison in `read-only-check.json`.

## Evidence and result

One headless Chromium run, protected by `flock /tmp/chrome.lock`, produced **41 clean PNG screenshots**: 21 at **1440×1000** and 20 at **390×844**, light appearance with normal motion. `SCREENSHOT-INDEX.json` records each filename, navigation URL, actual DOM/control rectangles, screenshot hash, checks, and console errors.

Required coverage is complete: home; results for Chartres, Notre-Dame de Paris, Cologne, and Amiens at both widths; story scenes **1 and 4 for all four buildings on desktop**, plus Chartres on mobile; and Chartres **inside start plus Nave, Pointed arch, Triforium, Clerestory, Rib vault, Rose window, and Flying buttress** at both widths. **Eleven pin captures required diagnostic DOM clicks after real pointer clicks failed.** Those entries are explicitly labeled and are not evidence of user reachability.

The browser recorded **56 passing and 11 failing assertions**. Passing checks include all eight result photos loading, random verified-building entry, desktop story pause/previous/next/close for all four buildings, mobile Chartres story navigation, desktop short/unknown-name guards, typed-name resolution, nonrepeating “Another,” WebGL startup, and all seven definitions rendering. The app had **zero uncaught page errors**, but **25 console errors**. The driver then stopped at the mobile inside Back button, which was obstructed; its traceback is preserved, not a browser page error.

## Defects to send to Q7

| Severity / observed before | Suggested after — not implemented | Evidence / why |
| --- | --- | --- |
| **High:** On 390px, the model disclaimer intercepts the inside Back button. Back is at `(8,8)`, 257×44px; the disclaimer is at `(0,18)`, 370×54px. The click failed for the full 30-second timeout. | Place Back and the disclaimer in a nonoverlapping responsive header. | `shots/390-light-motion-inside-start.png`; `browser-evidence.json` → driver failure. Source: `style.css:58,96`, `app.js:155–158`. |
| **High:** Projected pin labels clip or become inaccessible after focusing another feature. Four desktop and seven mobile **sequential** pointer attempts failed; causes include the term/disclaimer intercepting clicks, offscreen projection, and hidden pins. This does not establish that each pin is unreachable from every camera angle. | Provide a persistent accessible feature list and clamp labels to the viewport; keep informational overlays clear of interaction regions. | `shots/390-light-motion-inside-start.png`: Clerestory begins at x=−19px; Triforium ends at x=418px; Flying buttress ends at x=468px. Exact per-click logs and diagnostic flags are in the index. Source: `app.js:196–241`, `style.css:89–102`. |
| **High, rendering-dependent:** The inside model is strongly overexposed in Sandbox Chromium/SwiftShader, making the pale definition, disclaimer, and hint difficult to read. This needs verification on real Mac/GPU rendering. | Reduce illumination/exposure and put explanatory text on a reliably contrasting surface. | `shots/1440-light-motion-inside-start.png` and `shots/390-light-motion-inside-start.png`. Source: `app.js:189–191`; transparent text overlays in `style.css:96–102`. |
| **Medium:** 24 console errors report invalid SVG paths: `Error: <path> attribute d: Expected number, "MM…"`. `pointedArch()` already returns `M`, but several templates prepend another `M`. Corresponding arch details are absent. | Remove the duplicated `M` and add an SVG-path regression check. | `shots/1440-light-motion-chartres-story-04.png`, also the mobile scene-four shot; `plates.js:4,13,20,22,24,31,33,38,40,49,52`. Eight distinct malformed-path messages are retained in the index. |
| **Medium:** Several hit regions are below the shared 44px control target: pin buttons are 38px high; story scene selectors are 24px high. Home placeholder contrast is **2.073:1** against the stone background. | Enlarge hit regions without enlarging every visible label; strengthen the placeholder color. | DOM dimensions in the index; `style.css:34,74,90`; exact sRGB calculations in `contrast-checks.json`. |
| **Low:** One console resource error reports 404. | Identify and remove/serve the missing request. | Recorded console text is retained; the failing URL was not captured, so it is **not attributed to a favicon without evidence**. |

The home/result/story typography and spacing are clear in the inspected screenshots. Result photos, credits, verified-fact/source disclosures, and “illustration / not a scan” labels are present. No fatal JavaScript error prevented the core result/story flow.

## Commands actually run

- `node --test /home/ubuntu/AI-round/analysis/p7-idea/app/test/slice.test.mjs`: **failed before tests**, because the transferred app has no installed `three` package. `npm test` was deliberately not run: its build pre-step rewrites application data.
- `node --loader /home/ubuntu/AI-round/analysis/p7-qa/vendor-loader.mjs --test /home/ubuntu/AI-round/analysis/p7-idea/app/test/slice.test.mjs`: **8/8 passed**, including the server traversal/method checks. The QA-only loader resolves `three` to the app’s already-bundled browser copy; the tests and application were unchanged.
- `node --check` on the app server, all four public JS files, and both build/fetch scripts: **passed**. `bash -n run-qa.sh`, `node --check vendor-loader.mjs`, and `python3 -m py_compile capture.py`: **passed**.
- `bash /home/ubuntu/AI-round/analysis/p7-qa/run-qa.sh`: started the original static server with `PORT=5817`, checked `/healthz` and HTTP response headers, then ran `flock -w 180 /tmp/chrome.lock python3 -u capture.py`. Evidence was saved despite the app-blocked Back interaction. The runner’s exit code is not a clean-browser-test claim; consult the recorded assertions and traceback.
- All 41 PNGs passed image decoding/integrity checks. Application hash comparison: **48/48 unchanged**. QA-owned server shut down; **no listener remained on 5817**.

## Limits and handoff

Per the parent’s 22:34 time-save instruction, no second browser run was performed. **820px, dark appearance, reduced motion, keyboard-only usage, full automatic story completion/replay, drag-based pin recovery, and Mac/Safari/GPU rendering are not verified.** Inside evidence uses Chartres’s route; the model itself is explicitly generic. Screenshot capture does not certify every inside pin as user-clickable. Later Q7 changes are not reflected here.

Final Mac app start command: `cd analysis/p7-idea/app && PORT=4817 node server.mjs`. Sandbox QA uses `PORT=5817`. No app restart or installation was performed on the Mac.

Resources actually read: the shared brief and q7qa assignment; build-principles, Poteto code-quality, Socratic scope, Emil design-engineering, Apple design, and image-processing skill files; Nave’s HTML, CSS, app/geometry/plate code, test/server/build script, package manifest, and design rationale §12. No external reference browsing, image generation, application modifications, Git commits, or publishing occurred. The broader design-study instructions were not applied to this QA-only assignment.
