#!/bin/bash
# Run this on your VPS as root
# Usage: bash setup.sh

set -e
echo "=== AI Caller VPS Setup ==="

# 1. Install Node 22
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
echo "Node: $(node -v)"

# 2. Install Python deps for voice
apt-get install -y python3-pip ffmpeg
pip3 install edge-tts faster-whisper

# 3. Install PostgreSQL if not running
if ! pg_isready &>/dev/null 2>&1; then
  apt-get install -y postgresql postgresql-contrib
  systemctl enable postgresql
  systemctl start postgresql
fi

# 4. Create DB + user
DB_NAME="aicaller"
DB_USER="aicaller"
DB_PASS="$(openssl rand -hex 16)"

sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || true

DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"

# 5. Run schema
PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d $DB_NAME -f /root/aicaller/backend/db/schema.sql

# 6. Write .env
cat > /root/aicaller/backend/.env <<EOF
DATABASE_URL=$DATABASE_URL
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d
PORT=4000
FRONTEND_URL=http://localhost:5173
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:1.7b
PUBLIC_URL=https://$(curl -s ifconfig.me)
# Add telephony keys below:
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=
EOF

# 7. Install npm deps
cd /root/aicaller/backend
npm install

# 8. Start with PM2
npm install -g pm2
pm2 start server.js --name "ai-caller-api"
pm2 save
pm2 startup

echo ""
echo "=== Done! ==="
echo "DATABASE_URL: $DATABASE_URL"
echo "API running on port 4000"
echo "Add your telephony keys to /root/aicaller/backend/.env then: pm2 restart ai-caller-api"
