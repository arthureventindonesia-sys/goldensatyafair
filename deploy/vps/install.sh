#!/usr/bin/env bash
set -euo pipefail

APP_NAME="goldensatyafair"
APP_DIR="/var/www/${APP_NAME}"
ENV_FILE="/etc/${APP_NAME}.env"
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
NGINX_FILE="/etc/nginx/sites-available/${APP_NAME}"
SRC_DIR="${1:-}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Jalankan sebagai root: sudo bash deploy/vps/install.sh /path/ke/source"
  exit 1
fi

if [[ -z "${SRC_DIR}" || ! -f "${SRC_DIR}/package.json" ]]; then
  echo "Pemakaian: sudo bash deploy/vps/install.sh /path/ke/folder-aplikasi"
  echo "Folder harus berisi package.json (hasil extract paket Golden Satya Fair)."
  exit 1
fi

SRC_DIR="$(cd "${SRC_DIR}" && pwd)"

read -r -p "Domain (contoh goldensatyafair.com, atau IP VPS): " APP_DOMAIN
APP_DOMAIN="${APP_DOMAIN:-$(hostname -I | awk '{print $1}')}"
read -r -p "Pasang HTTPS Let's Encrypt? (y/n) [n]: " WANT_SSL
WANT_SSL="${WANT_SSL:-n}"
read -r -s -p "Password database Postgres (kosong = dibuat otomatis): " DB_PASS
echo
if [[ -z "${DB_PASS}" ]]; then
  DB_PASS="$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)"
fi
AUTH_SECRET="$(openssl rand -hex 32)"

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates gnupg nginx postgresql postgresql-contrib ufw openssl rsync

if ! command -v node >/dev/null 2>&1 || ! node -v | grep -qE 'v2[2-9]'; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

id -u gsf >/dev/null 2>&1 || useradd --system --home "${APP_DIR}" --shell /usr/sbin/nologin gsf
mkdir -p "${APP_DIR}"
rsync -a --delete \
  --exclude node_modules \
  --exclude .output \
  --exclude .nitro \
  --exclude dist \
  --exclude .git \
  "${SRC_DIR}/" "${APP_DIR}/"

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'gsf') THEN
    CREATE ROLE gsf LOGIN PASSWORD '${DB_PASS}';
  ELSE
    ALTER ROLE gsf WITH PASSWORD '${DB_PASS}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE ${APP_NAME} OWNER gsf'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${APP_NAME}')\gexec
GRANT ALL PRIVILEGES ON DATABASE ${APP_NAME} TO gsf;
SQL

cat > "${ENV_FILE}" <<EOF
NODE_ENV=production
HOST=127.0.0.1
PORT=3000
NITRO_HOST=127.0.0.1
NITRO_PORT=3000
VITE_AUTH_ENABLED=true
BETTER_AUTH_URL=http://${APP_DOMAIN}
BETTER_AUTH_SECRET=${AUTH_SECRET}
DATABASE_URL=postgres://gsf:${DB_PASS}@127.0.0.1:5432/${APP_NAME}
EOF
chmod 640 "${ENV_FILE}"
chown root:gsf "${ENV_FILE}"

if [[ "${WANT_SSL}" =~ ^[Yy]$ ]]; then
  sed -i "s|^BETTER_AUTH_URL=.*|BETTER_AUTH_URL=https://${APP_DOMAIN}|" "${ENV_FILE}"
fi

chown -R gsf:gsf "${APP_DIR}"
cd "${APP_DIR}"
sudo -u gsf npm ci --omit=dev=false
set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a
sudo -u gsf env NITRO_PRESET=node-server NODE_ENV=production npm run build:vps

install -m 644 "${APP_DIR}/deploy/vps/goldensatyafair.service" "${SERVICE_FILE}"
sed "s/DOMAIN_HERE/${APP_DOMAIN}/g" "${APP_DIR}/deploy/vps/nginx.conf" > "${NGINX_FILE}"
ln -sfn "${NGINX_FILE}" "/etc/nginx/sites-enabled/${APP_NAME}"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable --now postgresql
systemctl daemon-reload
systemctl enable --now "${APP_NAME}"
systemctl reload nginx

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable || true

if [[ "${WANT_SSL}" =~ ^[Yy]$ ]]; then
  apt-get install -y certbot python3-certbot-nginx
  certbot --nginx -d "${APP_DOMAIN}" --non-interactive --agree-tos --register-unsafely-without-email || true
  systemctl reload nginx
fi

systemctl restart "${APP_NAME}"
echo
echo "Selesai."
echo "Situs: http://${APP_DOMAIN}"
echo "Admin: /admin  user iang"
echo "Update nanti: sudo bash ${APP_DIR}/deploy/vps/update.sh"
