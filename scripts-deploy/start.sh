#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

docker-compose up -d --build
docker-compose exec -T app sh -c 'if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then npm install --omit=dev --no-package-lock; fi'
