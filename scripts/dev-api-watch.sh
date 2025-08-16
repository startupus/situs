#!/usr/bin/env bash
set -euo pipefail

# Простая связка: tsc --watch (сборка в dist) + nodemon (перезапуск dist)
# Без внешних зависимостей типа concurrently

export PORT="${PORT:-3002}"
export NODE_ENV="${NODE_ENV:-development}"

echo "[DEV] Starting TypeScript compiler watch (tsconfig.server.json)"
(
  npx tsc -p tsconfig.server.json --watch
) &
TSC_PID=$!

cleanup() {
  echo "[DEV] Shutting down..."
  kill "$TSC_PID" >/dev/null 2>&1 || true
  kill "$NODE_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

# Ждём пока соберётся основной файл
echo "[DEV] Waiting for dist/server/main.js ..."
for i in {1..60}; do
  if [ -f "dist/server/main.js" ]; then
    break
  fi
  sleep 0.5
done

echo "[DEV] Starting nodemon on dist/server/main.js (PORT=$PORT)"
(
  npx nodemon --watch dist/server dist/server/main.js
) &
NODE_PID=$!

wait -n "$TSC_PID" "$NODE_PID"

