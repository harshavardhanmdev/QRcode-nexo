#!/usr/bin/env bash
# Port audit for the shared office server: lists everything listening, then
# prints free candidate ports in the 4600–4699 block for qrdock.
# Usage: bash deploy/port-audit.sh
set -euo pipefail

echo "== Currently listening (tcp) =="
ss -tlnp 2>/dev/null | awk 'NR>1 {print $4, $6}' | sort -u || true

echo
echo "== Free candidates in 4600–4699 =="
found=0
for p in $(seq 4600 4699); do
  if ! ss -tln "( sport = :$p )" 2>/dev/null | grep -q ":$p"; then
    echo "FREE $p"
    found=$((found + 1))
    [ "$found" -ge 6 ] && break
  fi
done

if [ "$found" -eq 0 ]; then
  echo "No free ports in 4600–4699 — widen the range in this script."
  exit 1
fi

echo
echo "Pick two (web + api) and write them into .env.production as WEB_PORT / API_PORT."
