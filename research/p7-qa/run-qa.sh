#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$(cd "$ROOT/../p7-idea/app" && pwd)"
cd "$ROOT"
node --check vendor-loader.mjs
python3 -m py_compile capture.py
node --loader "$ROOT/vendor-loader.mjs" --test "$APP/test/slice.test.mjs" > node-tests-vendored.log 2>&1
PORT=5817 node "$APP/server.mjs" > server.log 2>&1 &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; wait "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT INT TERM
for attempt in $(seq 1 30); do
  if curl --fail --silent http://127.0.0.1:5817/healthz > health-check.log; then break; fi
  sleep .2
done
kill -0 "$SERVER_PID"
curl --fail --silent --show-error -D response-headers.log http://127.0.0.1:5817/ -o /dev/null
printf 'Waiting for shared Chromium lock; static server is healthy.\n'
flock -w 180 /tmp/chrome.lock python3 -u "$ROOT/capture.py" | tee browser-run.log
printf 'Browser capture complete; stopping QA-owned server.\n'
