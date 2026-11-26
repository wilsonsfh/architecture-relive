# Problem 7 — ideation and research notes

Read shared brief completely at 2026-11-25 20:50 SGT. Analysis only; no product code, installs, GUI launches, or changes outside the two assigned analysis paths. Prior `slop-pyramid-demo` is excluded from reuse and ideation.

Read local Emil skills: emil-design-eng, animate, choreograph, apple-design; dickwu Apple design SKILL plus accessibility, layout, typography, color, designing-for-macos, cross-platform, motion, privacy, charting-data, buttons, undo-and-redo, generative-ai. Also build-principles, poteto-agent-code-quality, deep-research, workflow-composer, Jane Street Socratic tutor.

Workflow-composer calls are parent-only in the binding shared brief; nested fan-out cannot run here. Treat the landscape as one coupled discovery-and-selection task, batch searches/fetches, preserve verified evidence. Do not claim independent agent checks occurred. Parent can orchestrate further item checks if useful.

Initial direction: avoid a generic tutor/chat, abstract trust dashboard, shader-only art toy, and all six other problems' visual identities. Seek a falsifiable, tactile experiment with a single surprising causal reveal, deterministic runtime, and a personal rationale Wilson can accept or reject honestly.

## Verified landscape observations

Opened 2026-11-25: Product Hunt GoPractice https://www.producthunt.com/products/simulator-by-gopractice (hands-on data-driven product decision simulator; do not treat reviews as proof). GitHub trending https://github.com/trending (live selected listings include agent skills, reliability, knowledge work, video tools; no claim about complete market). Latest Show HN https://news.ycombinator.com/shownew (actual latest feed includes atlas quiz, music-making game, interactive Riemann explainer). Opened the latter https://shayon.work/riemann; it has successive draggable math models and progressive disclosure. Its news/proof claims are OUTSIDE verification and must not be repeated as fact.

Opened LOOPY https://ncase.me/loopy/ (draw circles/arrows, remix simulations); Seeing Theory https://seeing-theory.brown.edu/ (archived, D3-based probability/statistics chapters); PhET https://phet.colorado.edu/ (research-based game-like sims and accessibility resources); MiniSimulator https://a-herzog.github.io/MiniSimulator/ (G/G/c/K+G in JS, rich distributions and policies, event-step logs, runs entirely in browser). Catalog https://github.com/A-Herzog/awesome-queueing-theory-software confirms adjacent queue software is mature.

Opened https://explorableillusions.com/simulations/braess-paradox/ (published 13 Nov 2026, exact toy equilibria, change-count challenge). Reject traffic-paradox idea as a direct territory collision.

Craft opened: https://gsap.com/showcase/ (dynamic gallery extraction only); https://tympanus.net/codrops/hub/author/gsap/ (specific timeline/Flip/Three.js demos listed); https://www.awwwards.com/inspiration/3d-storytelling-experience-vredestein-new-horizons (metadata confirms 3D/WebGL/interactive/storytelling, visual playback not verified); https://threejs.org/ (current showcase discovery). Blobmixer https://blobmixer.14islands.com/ only returned loading text: do not claim its visuals were inspected.

Engineering sources opened: https://cacm.acm.org/research/the-tail-at-scale/ (variability, queue amplification, head-of-line blocking and time slicing; original 2013 primary research); GSAP Timeline, context, matchMedia official docs; Three.js BufferGeometry official docs; InstancedMesh docs extraction was navigation-heavy, so opened official raw source to verify setMatrixAt, instanceMatrix.needsUpdate, bounding calculations and disposal.

## Direction revision

Working title WAITWEAVE: a tactile lab for why averages lie. Narrow to identical jobs under FIFO versus round-robin time slicing; compare actual trace, not two different random worlds. Material identity is cut ribbons/matte folded paper on lavender, cobalt service, apricot waiting; no glass, terminal, card grid, voice pill, agent side panel, or patch-bay ports/cables. Only-one feature: identity-preserving counterfactual loom, where one job's waiting/service path can be followed through both worlds and all work remains accounted for. Personal rationale is a proposal Wilson must honestly endorse, not an invented autobiography.

## Final decision evidence

Primary WAITWEAVE; runner LIGHTFOLD. Scores [O,W,M,D,F,V,S,B], weights [22,18,10,12,18,8,6,6]. Primary [4,5,4,5,4,5,5,5] =4.50; Lightfold [3,5,4,5,4,5,5,5] =4.28; Aftertone [4,5,4,5,3,5,5,4] =4.26. Originality-heavy primary4.40; feasibility-heavy primary4.45.

Canonical jobs: 12, integer arrival i*5 for i0..11; required work [13,1,1,1]*3; FIFO versus RR quantum1. New arrivals at slice endpoint enqueue BEFORE requeuing unfinished current job. Independent Python reference characterization only, not a built product: FIFO completion latencies [13,9,5,1]*3; waits [0,8,4,0]*3; mean completion7; shortmean5; long13; service48; finalcompletion56. RR completion [15,1,1,1]*3; wait [2,0,0,0]*3; meancompletion4.5; shortmean1; long15; service48; finalcompletion56. Avoid OS response-time terminology: use time-to-completion or completion latency, first-service delay separate. Quantum minimum1 prevents loop pathology; switching cost0 is disclosed toy assumption.

Computed WCAG contrast: #29213D on #E9E5F4 12.31; #625773 on #E9E5F4 5.42; #3451B2 on #E9E5F4 5.72; #FFF8F3 on #B7511D 4.75; #29213D on #F3AB82 7.95. Dark #ECE7F7 on #241D35 13.32; #BFB3D1 on #241D35 8.13; #AEBFFF on #241D35 8.98; #FFBA93 on #241D35 9.75. Apricot is data material, not small text on lavender.

Additional opened: https://github.com/jithesh-poojari/process-scheduling-visualization (FCFS/RR already compared side-by-side, exact metric definitions, NOT reused); https://smartcpuscheduler.com/ (Start/Pause/Step/Reset Gantt OS lab product); https://codefarm.in/labs/simulators/latency (distribution presets and percentiles); https://www.viktorcessan.com/queue-simulator/ (conceptual illustration, not prescriptive model); https://codepen.io/GreenSock/pen/GgpMeZp (actual code read; GSAP timeline + Flip canvas + Three cube; no copying). https://www.shadowmatic.com/ official confirms rotate abstract objects to recognizable silhouettes, so runner originality only3. https://roomsim.spinorama.org/ actual room controls confirm AFTERTONE adjacent competition.

Official engineering URLs: https://gsap.com/docs/v3/GSAP/Timeline/ ; https://gsap.com/docs/v3/GSAP/gsap.context%28%29/ ; https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/ ; https://gsap.com/docs/v3/Plugins/Flip/ ; https://threejs.org/docs/pages/BufferGeometry.html ; https://threejs.org/docs/pages/WebGLRenderer.html ; https://raw.githubusercontent.com/mrdoob/three.js/dev/src/objects/InstancedMesh.js . CustomEase docs verification challenge; actual official source read https://raw.githubusercontent.com/greensock/GSAP/master/src/CustomEase.js confirms four-number cubic-bezier data and CustomEase.create. Current fetched source version3.15.1; don't require it blindly, pin installed compatible package and verify build.

Read local webdev, webdev-worklocally, video-editor skills. Recommend managed web app only after hosting choice; isolated new folder, no prior-project reuse; explicit runtime/post-edit diagnostics, declared dev-commands, real client-routes JSON, Local Managed Git checkpoint receipt not bare Git success. Parent-only MCP recommendations; do not invoke here. Video Editor real screen capture imports, editable title/captions, export_project; no generated reenactment of working UI. Slides optional, no game/automation/Cloud Computer forced into core.
