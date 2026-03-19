#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
WEB_DIR="$ROOT_DIR/web"
PRED_DIR="$ROOT_DIR/prediction-service"

ensure_env() {
  if [ ! -f "$1/.env" ] && [ -f "$1/.env.example" ]; then
    cp "$1/.env.example" "$1/.env"
  fi
}

ensure_env "$BACKEND_DIR"
ensure_env "$WEB_DIR"

if [ ! -d "$BACKEND_DIR/node_modules" ]; then
  (cd "$BACKEND_DIR" && npm install)
fi

if [ ! -d "$WEB_DIR/node_modules" ]; then
  (cd "$WEB_DIR" && npm install)
fi

if [ ! -d "$PRED_DIR/.venv" ]; then
  python3 -m venv "$PRED_DIR/.venv"
  "$PRED_DIR/.venv/bin/pip" install -r "$PRED_DIR/requirements.txt"
fi

"$PRED_DIR/.venv/bin/uvicorn" app.main:app --reload --port 8000 --app-dir "$PRED_DIR/app" &
PRED_PID=$!

(cd "$BACKEND_DIR" && npm run dev) &
BACKEND_PID=$!

(cd "$WEB_DIR" && npm run dev) &
WEB_PID=$!

trap "kill $PRED_PID $BACKEND_PID $WEB_PID 2>/dev/null" EXIT

wait
