#!/usr/bin/env bash
# =============================================================================
# Tailscale Setup für den Intel NUC
#
# Was dieses Skript tut:
#   1. Tailscale installieren (falls noch nicht vorhanden)
#   2. Tailscale mit SSH-Unterstützung verbinden
#   3. SSH auf Tailscale-Netz einschränken (UFW)
#   4. Tailscale Serve konfigurieren (OpenClaw Gateway nur im Tailnet)
#
# Ausführen: sudo bash scripts/setup-tailscale.sh
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'
BOLD='\033[1m'; RESET='\033[0m'
info()    { echo -e "${CYAN}[INFO]${RESET} $*"; }
success() { echo -e "${GREEN}[OK]${RESET}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET} $*"; }
error()   { echo -e "${RED}[ERR]${RESET}  $*" >&2; exit 1; }

[[ $EUID -ne 0 ]] && error "Bitte als root ausführen: sudo bash scripts/setup-tailscale.sh"

# ── Tailscale installieren ───────────────────────────────────────────────────
if ! command -v tailscale &>/dev/null; then
  info "Tailscale installieren..."
  curl -fsSL https://tailscale.com/install.sh | sh
  systemctl enable --now tailscaled
  success "Tailscale installiert"
else
  success "Tailscale bereits installiert: $(tailscale version | head -1)"
fi

# ── Tailscale verbinden ──────────────────────────────────────────────────────
TAILSCALE_STATUS=$(tailscale status --json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('BackendState',''))" 2>/dev/null || echo "unknown")

if [[ "${TAILSCALE_STATUS}" != "Running" ]]; then
  info "Tailscale verbinden..."
  echo ""
  echo -e "${YELLOW}Öffne die folgende URL in einem Browser und melde dich an:${RESET}"
  echo ""
  tailscale up \
    --ssh \
    --accept-routes=false \
    --advertise-exit-node=false \
    --hostname=openclaw-nuc
  echo ""
  success "Tailscale verbunden"
else
  success "Tailscale bereits verbunden"
fi

# Tailscale IP ermitteln
TS_IP=$(tailscale ip -4 2>/dev/null || echo "")
TS_HOSTNAME=$(tailscale status --json 2>/dev/null \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['Self']['DNSName'].rstrip('.'))" 2>/dev/null || echo "")

info "Tailscale IP:   ${TS_IP}"
info "Tailscale Host: ${TS_HOSTNAME}"

# ── UFW: SSH nur noch über Tailscale erlauben ────────────────────────────────
info "SSH-Zugang auf Tailscale-Netz einschränken..."

# Tailscale-Subnetz: 100.64.0.0/10
ufw delete allow in on any to any port 22 proto tcp 2>/dev/null || true
ufw allow in from 100.64.0.0/10 to any port 22 proto tcp comment "SSH via Tailscale"

# Die eigene Tailscale-IP explizit erlauben
if [[ -n "${TS_IP}" ]]; then
  ufw allow in from "${TS_IP}" to any port 22 proto tcp comment "SSH direkt Tailscale IP"
fi

ufw reload
success "SSH jetzt nur noch über Tailscale-Netz erreichbar"
warn "Stelle sicher, dass du über Tailscale SSH-Zugang hast, bevor du dich ausloggst!"

# ── Tailscale Serve: Gateway ins Tailnet exponieren ──────────────────────────
# (Der Container exponiert Port 18789 intern – Tailscale Serve macht ihn
#  als HTTPS im Tailnet erreichbar, OHNE öffentliches Internet)
info "Tailscale Serve konfigurieren..."

# Alte Serve-Konfiguration entfernen
tailscale serve reset 2>/dev/null || true

# OpenClaw Gateway über HTTPS im Tailnet bereitstellen
tailscale serve --bg https / http://127.0.0.1:18789
# ODER: port-basiert (je nach openclaw-Version)
# tailscale serve --bg https+insecure://127.0.0.1:18789

success "Tailscale Serve konfiguriert"
echo ""
tailscale serve status
echo ""

# ── Abschluss ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}Tailscale Setup abgeschlossen!${RESET}"
echo ""
echo -e "  OpenClaw wird erreichbar sein unter:"
if [[ -n "${TS_HOSTNAME}" ]]; then
  echo -e "  ${CYAN}https://${TS_HOSTNAME}${RESET}  (nur im Tailnet!)"
fi
echo ""
echo -e "  Nächster Schritt: ${CYAN}docker compose up -d${RESET}"
echo ""
