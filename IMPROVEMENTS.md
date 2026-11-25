# Improvements and unresolved items (written 2026-11-26 00:24 +08, Coordinator v2)
Notes for later. Nothing below was verified in Safari or on the Mac screen; checks were Sandbox Chromium or curl only.

## Q7 Architecture Magic
- Full media exists only for Chartres (6/6), Cologne (5/5) and Notre-Dame (5/5). All other buildings show labelled placeholders. Next: generate media for more buildings.
- Line-SVG per-step motifs rotate by keyword; check in a browser that each step reads differently.
- The interior is a simplified procedural model, not a scan; keep the label.
- 11 buildings have rough custom silhouettes not checked against photos.
- /tmp/am-p7-2358.zip lacks the 00:00-00:17 media; cut a fresh bundle before any QA.
- Likeness guardrails: generic people only, no baked text, always labelled AI-generated.
