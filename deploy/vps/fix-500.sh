#!/usr/bin/env bash
set -euo pipefail
# Perbaiki error 500 { "unhandled": true } pada build Nitro yang sudah terpasang.
# Jalankan sebagai root: bash deploy/vps/fix-500.sh

APP_DIR="${1:-/var/www/goldensatyafair}"
if [[ "$(id -u)" -ne 0 ]]; then
  echo "Jalankan sebagai root: sudo bash deploy/vps/fix-500.sh"
  exit 1
fi
if [[ ! -d "${APP_DIR}/.output/server" ]]; then
  echo "Folder build tidak ada: ${APP_DIR}/.output/server"
  echo "Pasang dulu dengan install.sh, atau clone lalu update.sh"
  exit 1
fi
cd "${APP_DIR}"
node "${APP_DIR}/scripts/patch-ssr-exports.mjs" || node /tmp/patch-ssr.mjs || true
if [[ -f "${APP_DIR}/scripts/patch-ssr-exports.mjs" ]]; then
  node "${APP_DIR}/scripts/patch-ssr-exports.mjs"
fi
systemctl restart goldensatyafair
sleep 2
systemctl --no-pager --full status goldensatyafair || true
echo "Coba buka situs lagi."
