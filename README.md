# OpenClaw auf Intel NUC – Sicher via Tailscale & Telegram

Dieses Repo enthält die komplette, gehärtete Deployment-Konfiguration für
[OpenClaw](https://openclaw.ai) auf einem Intel NUC7i5:

- **Container-isoliert** via Docker (non-root, minimale Capabilities)
- **Nur über Tailscale erreichbar** – kein öffentlicher Port
- **Telegram als Interface** – du schreibst deinem Bot, er antwortet mit Claude
- **Claude Sonnet 4.6** als KI-Modell (Anthropic API)

## Architektur

```
Dein Handy/PC
    │
    │  Tailscale VPN (verschlüsselt, mutual auth)
    ▼
Intel NUC (openclaw-nuc.ts.net)
    │
    │  Docker Network (intern, kein Host-Port)
    ├─► tailscale-sidecar  ← TLS-Terminierung, Tailnet-Auth
    └─► openclaw-app       ← Gateway auf 127.0.0.1:18789
            │
            └──► api.telegram.org  (ausgehend, Telegram-Bot)
            └──► api.anthropic.com (ausgehend, Claude API)
```

**Wichtig:** OpenClaw läuft komplett im Container. Kein Port ist am Host
erreichbar – weder SSH noch der Gateway. Zugriff nur über Tailscale.

---

## Voraussetzungen

- Intel NUC mit **Ubuntu 24.04 LTS** (empfohlen) oder Debian 12
- Internetverbindung (Tailscale + API-Calls)
- [Tailscale-Account](https://tailscale.com) (kostenlos bis 3 Geräte)
- [Anthropic API Key](https://console.anthropic.com/)
- Telegram-Account

---

## Setup (Schritt für Schritt)

### 1. Repository klonen

```bash
git clone https://github.com/Majorr77/openclaw.git
cd openclaw
```

### 2. Host vorbereiten (Docker, UFW, SSH-Hardening)

```bash
sudo bash scripts/setup-host.sh
```

Dies installiert Docker, konfiguriert die Firewall und härtet SSH.

> **Wichtig:** Stelle sicher, dass dein SSH-Public-Key in
> `~/.ssh/authorized_keys` hinterlegt ist – danach wird
> Passwort-Auth deaktiviert!

### 3. Secrets eintragen

```bash
cp .env.example .env
chmod 600 .env
nano .env
```

| Variable | Woher? |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `TELEGRAM_BOT_TOKEN` | Telegram → @BotFather → `/newbot` |
| `TELEGRAM_ALLOWED_USERS` | Telegram → @userinfobot → deine ID |
| `TS_AUTHKEY` | [Tailscale Admin → Keys](https://login.tailscale.com/admin/settings/keys) |

#### Telegram Bot Token holen

1. Öffne Telegram und schreib `@BotFather`
2. Sende `/newbot`
3. Vergib einen Namen (z.B. "Mein NUC Assistant")
4. Vergib einen Username (z.B. `mein_nuc_bot`)
5. Kopiere den Token (sieht aus wie `1234567890:ABC...xyz`)

#### Deine Telegram-User-ID herausfinden

1. Schreib `@userinfobot` auf Telegram
2. Sende eine beliebige Nachricht
3. Kopiere die numerische ID (z.B. `123456789`)

### 4. OpenClaw-Konfiguration prüfen

Die Datei `config/openclaw.json` enthält die OpenClaw-Konfiguration.
Eingestellt ist bereits:

- Modell: `claude-sonnet-4-6` (mit Haiku als Fallback)
- Telegram-Channel aktiviert
- DM-Policy: `allowlist` – nur du kannst mit dem Bot reden
- Telemetry: deaktiviert

### 5. Tailscale verbinden

```bash
sudo bash scripts/setup-tailscale.sh
```

Das Skript:
- Installiert Tailscale (falls noch nicht vorhanden)
- Verbindet den NUC mit deinem Tailnet
- Schränkt SSH auf Tailscale-Zugriff ein
- Konfiguriert Tailscale Serve (HTTPS im Tailnet → Gateway)

### 6. Container starten

```bash
docker compose up -d
```

Beim ersten Start wird das OpenClaw-Image gebaut (~2-3 Minuten).

Status prüfen:

```bash
docker compose ps
docker compose logs -f openclaw
```

### 7. Telegram-Bot testen

Öffne Telegram und schreib deinem Bot. OpenClaw sollte antworten!

---

## Tägliche Bedienung

```bash
# Logs live ansehen
docker compose logs -f openclaw

# Neu starten (z.B. nach Config-Änderung)
docker compose restart openclaw

# Alles stoppen
docker compose down

# Update: neues Image bauen und deployen
docker compose up -d --build
```

---

## Sicherheitsübersicht

| Schicht | Maßnahme |
|---|---|
| **Netzwerk** | Kein Port am Host offen; alles läuft über Tailscale VPN |
| **Tailscale** | Mutual TLS, Device-Auth, Tailnet-only (kein Funnel) |
| **Docker** | Non-root User (UID 1001), `no-new-privileges`, alle Capabilities gedroppt |
| **OpenClaw** | Allowlist-Policy: nur deine Telegram-ID kann interagieren |
| **Firewall** | UFW: nur Tailscale-Port + SSH (ausschließlich via Tailnet) |
| **SSH** | Public-Key only, kein Root-Login, Fail2Ban aktiv |
| **Updates** | Automatische Sicherheitsupdates via unattended-upgrades |
| **Secrets** | `.env`-Datei (chmod 600), nicht in Git |

### Hinweis: Prompt-Injection

OpenClaw führt KI-gesteuerte Aktionen auf deinem System aus. Beachte:

- Der Bot antwortet nur dir (Allowlist) – kein anderer kann ihn ansprechen
- Vertraue keinen Inhalten, die OpenClaw zu ungewollten Aktionen verleiten könnten
- Überprüfe regelmäßig die Logs auf verdächtige Aktivitäten

---

## Troubleshooting

**Container startet nicht:**
```bash
docker compose logs openclaw
docker compose logs tailscale
```

**Tailscale verbindet nicht:**
```bash
tailscale status
tailscale ping openclaw-nuc
```

**Bot antwortet nicht:**
1. Prüfe ob `TELEGRAM_BOT_TOKEN` korrekt ist
2. Prüfe ob deine User-ID in `TELEGRAM_ALLOWED_USERS` steht
3. Logs: `docker compose logs -f openclaw`

**OpenClaw Gateway nicht erreichbar:**
```bash
# Vom NUC aus:
curl http://127.0.0.1:18789/health

# Tailscale Serve Status:
tailscale serve status
```

---

## Dateien

```
openclaw/
├── Dockerfile                    # OpenClaw Container-Image (non-root, Alpine)
├── docker-compose.yml            # Orchestrierung: openclaw + tailscale sidecar
├── .env.example                  # Vorlage für Secrets (→ .env kopieren)
├── .gitignore                    # .env und Secrets werden NICHT eingecheckt
├── config/
│   ├── openclaw.json             # OpenClaw-Konfiguration (Telegram, Allowlist)
│   └── tailscale-serve.json      # Tailscale Serve Konfiguration
└── scripts/
    ├── setup-host.sh             # Host: Docker, UFW, SSH-Hardening
    └── setup-tailscale.sh        # Tailscale verbinden + Serve konfigurieren
```

---

## Quellen

- [OpenClaw Dokumentation](https://docs.openclaw.ai)
- [Tailscale Serve Docs](https://tailscale.com/kb/1312/serve)
- [Tailscale Docker Sidecar](https://tailscale.com/kb/1282/docker)
- [Anthropic API Console](https://console.anthropic.com)
