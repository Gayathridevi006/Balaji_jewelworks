#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$repo_root"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install and start Docker Desktop, then rerun ./run.sh." >&2
  exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose is required. Install or update Docker Desktop, then rerun ./run.sh." >&2
  exit 1
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example. Review its local settings before continuing."
fi

echo "Starting Balaji Jewellery Works at http://localhost:3000 (API docs: http://localhost:8000/docs)."
echo "Press Ctrl+C to stop the local services."
exec docker compose up --build "$@"
