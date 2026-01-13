#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

docker-compose up -d --build
docker-compose exec -T app sh -c 'set -e; HASH_FILE="node_modules/.package-hash"; CURRENT_HASH="$(sha256sum package.json | awk "{print \$1}")"; STORED_HASH=""; if [ -f "$HASH_FILE" ]; then STORED_HASH="$(cat "$HASH_FILE")"; fi; if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ] || [ "$CURRENT_HASH" != "$STORED_HASH" ]; then npm install --omit=dev --no-package-lock; mkdir -p node_modules; echo "$CURRENT_HASH" > "$HASH_FILE"; fi'
