# architecture-relive

Live: https://architecture-relive.wilsonsoon.workers.dev

The original prototype lives in `app/`. The hosted version serves the existing building catalog, saved scene photos, generated media and 3D interiors. Live Wikipedia/model lookup remains a local-app feature; no model key is uploaded and AI generation is not enabled publicly.

Fetch the runtime media first with `git lfs pull --include="app/public/**"`. Build: `node scripts/build-cloudflare.mjs`. Deploy: `wrangler deploy`.
