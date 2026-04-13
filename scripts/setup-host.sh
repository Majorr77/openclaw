#!/usr/bin/env bash
# =============================================================================
# Host-Setup für den Intel NUC
# Installiert: Docker, UFW-Firewall, automatische Sicherheitsupdates
# Ausführen: sudo bash scripts/setup-host.sh
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'
BOLD='\033[1m'; RESET='\033[0m'
info()    { echo -e "${CYAN}[INFO]${RESET} $*"; }
success() { echo -e "${GREEN}[OK]${RESET}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET} $*"; }
error()   { echo -e "${RED}[ERR]${RESET}  $*" >&2; exit 1; }

[[ $EUID -ne 0 ]] && error "Bitte als root ausführen: sudo bash scripts/setup-host.sh"

# ── Pakete aktualisieren ─────────────────────────────────────────────────────
info "System aktualisieren..."
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq \
  curl wget gnupg2 ca-certificates lsb-release \
  ufw fail2ban \
  unattended-upgrades apt-listchanges

# ── Docker installieren ──────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  info "Docker installieren..."
  curl -fsSL https://get.docker.com | sh
  # Aktuellen Sudo-User zur docker-Gruppe hinzufügen
  SUDO_USER_ACTUAL=${SUDO_USER:-}
  if [[ -n "${SUDO_USER_ACTUAL}" ]]; then
    usermod -aG docker "${SUDO_USER_ACTUAL}"
    warn "User '${SUDO_USER_ACTUAL}' zur docker-Gruppe hinzugefügt."
    warn "Bitte einmal ab- und anmelden damit es wirksam wird."
  fi
  systemctl enable --now docker
  success "Docker installiert: $(docker --version)"
else
  success "Docker bereits installiert: $(docker --version)"
fi

# Docker Daemon absichern
info "Docker Daemon absichern..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<'EOF'
{
  "live-restore": true,
  "userland-proxy": false,
  "no-new-privileges": true,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
systemctl reload docker
success "Docker Daemon gesichert"

# ── UFW Firewall ─────────────────────────────────────────────────────────────
info "UFW Firewall konfigurieren..."

# Firewall zurücksetzen (sauber starten)
ufw --force reset

# Standardregeln: alles blockieren
ufw default deny incoming
ufw default allow outgoing

# SSH nur erlauben – ACHTUNG: Danach SSH-Zugang testen bevor UFW aktiviert wird!
ufw allow in on any to any port 22 proto tcp comment "SSH (wird nach Tailscale-Setup eingeschränkt)"

# Tailscale UDP-Port
ufw allow 41641/udp comment "Tailscale"

# Docker-interne Kommunikation (falls nötig)
# ufw allow in on docker0 comment "Docker bridge"

ufw --force enable
success "UFW aktiv: $(ufw status | head -1)"

# ── Fail2Ban ─────────────────────────────────────────────────────────────────
info "Fail2Ban konfigurieren..."
cat > /etc/fail2ban/jail.d/sshd.local <<'EOF'
[sshd]
enabled  = true
port     = ssh
maxretry = 3
bantime  = 3600
findtime = 600
ignoreip = 100.64.0.0/10
EOF
systemctl enable --now fail2ban
success "Fail2Ban aktiv"

# ── Automatische Sicherheitsupdates ──────────────────────────────────────────
info "Automatische Sicherheitsupdates aktivieren..."
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
cat > /etc/apt/apt.conf.d/50unattended-upgrades <<'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF
success "Automatische Updates aktiviert"

# ── SSH Hardening ─────────────────────────────────────────────────────────────
info "SSH absichern..."
SSHD_CONF="/etc/ssh/sshd_config.d/99-hardening.conf"
cat > "${SSHD_CONF}" <<'EOF'
# OpenClaw NUC – SSH Hardening
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
X11Forwarding no
AllowTcpForwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
EOF
sshd -t && systemctl reload sshd
success "SSH gehärtet (nur Public-Key-Auth, kein Root-Login)"
warn "Sicherstelle, dass dein SSH-Public-Key hinterlegt ist, bevor du dich ausloggst!"

# ── Abschluss ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}Host-Setup abgeschlossen!${RESET}"
echo ""
echo -e "  Nächste Schritte:"
echo -e "  1. ${CYAN}cd /pfad/zu/openclaw${RESET}"
echo -e "  2. ${CYAN}cp .env.example .env && chmod 600 .env${RESET}"
echo -e "  3. ${CYAN}nano .env${RESET}  ← Secrets eintragen"
echo -e "  4. ${CYAN}sudo bash scripts/setup-tailscale.sh${RESET}"
echo -e "  5. ${CYAN}docker compose up -d${RESET}"
echo ""
