#!/usr/bin/env bash
set -euo pipefail

echo "Bootstrapping soroban-devkit..."
pnpm install
pnpm -w build

echo "Bootstrap complete"
