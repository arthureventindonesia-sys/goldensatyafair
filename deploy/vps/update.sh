#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/goldensatyafair"
ENV_FILE="/etc/goldensatyafair.env"
SRC_DIR="${1:-}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Jalankan sebagai root: sudo bash deploy/vps/update.sh /path/ke/source-baru"
  exit 1
fi

if [[ -n "${SRC_DIR}" ]]; then
  if [[ ! -f "${SRC_DIR}/package.json" ]]; then
    echo "Folder sumber tidak valid."
    exit 1
  fi
  SRC_DIR="$(cd "${SRC_DIR}" && pwd)"
  rsync -a --delete \
    --exclude node_modules \
    --exclude .output \
    --exclude .nitro \
    --exclude dist \
    --exclude .git \
    "${SRC_DIR}/" "${APP_DIR}/"
fi

chown -R gsf:gsf "${APP_DIR}"
cd "${APP_DIR}"
sudo -u gsf npm ci --omit=dev=false
sudo -u gsf bash -lc "set -a; source '${ENV_FILE}'; set +a; export NITRO_PRESET=node-server NODE_ENV=production; cd '${APP_DIR}'; npm run build:vps"
install -m 644 "${APP_DIR}/deploy/vps/goldensatyafair.service" /etc/systemd/system/goldensatyafair.service
systemctl daemon-reload
systemctl restart goldensatyafair
echo "Update selesai."
