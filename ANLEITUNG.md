# OpenClaw einrichten – Schritt für Schritt

---

## Was du brauchst (bevor du anfängst)

Besorge diese 4 Dinge zuerst. Das dauert ca. 10 Minuten.

---

### Ding 1 – Claude API Key

1. Gehe zu **console.anthropic.com** → Account erstellen → einloggen
2. Klicke links auf **"API Keys"**
3. Klicke **"Create Key"** → Name: `nuc`
4. Kopiere den Key (sieht so aus: `sk-ant-api03-xxxx...`)
5. Lade unter **"Billing"** etwas Guthaben auf (5 € reichen zum Starten)

> Den Key nur einmal sichtbar – sofort irgendwo zwischenspeichern!

---

### Ding 2 – Telegram Bot Token

1. Öffne Telegram → suche `@BotFather`
2. Schreibe `/newbot`
3. BotFather fragt nach einem **Namen** → z.B. `Mein Assistent`
4. BotFather fragt nach einem **Username** → muss auf `_bot` enden, z.B. `mein_nuc_bot`
5. BotFather schickt dir einen Token (sieht so aus: `1234567890:ABCdef...`)
6. Diesen Token kopieren

---

### Ding 3 – Deine Telegram User-ID

1. Suche in Telegram `@userinfobot`
2. Schreibe irgendetwas
3. Er antwortet mit: `Your user id: 123456789`
4. Diese Zahl kopieren

---

### Ding 4 – Tailscale Auth Key

1. Gehe zu **tailscale.com** → Account erstellen (kostenlos)
2. Gehe zu: **login.tailscale.com/admin/settings/keys**
3. Klicke **"Generate auth key"**
4. Einstellungen: **Reusable** = AN, **Ephemeral** = AUS
5. Klicke **"Generate key"**
6. Kopiere den Key (sieht so aus: `tskey-auth-xxxx...`)

---

---

## Jetzt geht's los – am NUC

Alles folgende machst du **auf dem NUC** im Terminal.

---

### Schritt 1 – SSH-Key einrichten

> Das ist wichtig! Danach wird Passwort-Login deaktiviert.

**Auf deinem PC/Mac** (nicht am NUC):

```bash
ssh-keygen -t ed25519
```
Dreimal Enter drücken.

```bash
ssh-copy-id deinuser@192.168.1.xxx
```
(Die IP deines NUC einsetzen. Passwort eingeben – zum letzten Mal.)

**Testen** – muss ohne Passwort klappen:
```bash
ssh deinuser@192.168.1.xxx
```

---

### Schritt 2 – Repo herunterladen

```bash
sudo apt install -y git
git clone https://github.com/Majorr77/openclaw.git
cd openclaw
```

---

### Schritt 3 – Host einrichten

```bash
sudo bash scripts/setup-host.sh
```

Wartet bis es fertig ist (~3 Minuten). Installiert Docker, Firewall, Updates.

---

### Schritt 4 – Deine Keys eintragen

```bash
cp .env.example .env
chmod 600 .env
nano .env
```

Ersetze die Platzhalter mit deinen echten Werten:

```
ANTHROPIC_API_KEY=sk-ant-api03-DEIN_KEY
TELEGRAM_BOT_TOKEN=1234567890:DEIN_TOKEN
TELEGRAM_ALLOWED_USERS=123456789
TS_AUTHKEY=tskey-auth-DEIN_KEY
```

Speichern: `Strg+O` → Enter → `Strg+X`

---

### Schritt 5 – Tailscale verbinden

```bash
sudo bash scripts/setup-tailscale.sh
```

Das Skript zeigt einen Link:
```
To authenticate, visit:
https://login.tailscale.com/a/XXXXXXXX
```

Diesen Link auf deinem Handy oder PC öffnen und bestätigen.

Danach auf deinem **Handy**: Tailscale-App installieren (tailscale.com/download), mit demselben Account einloggen.

---

### Schritt 6 – OpenClaw starten

```bash
docker compose up -d
```

Beim ersten Start dauert das 3-4 Minuten (Image wird gebaut).

Prüfen ob alles läuft:
```bash
docker compose ps
```

Beide Container müssen `Up` anzeigen:
```
openclaw-tailscale   Up
openclaw-app         Up
```

---

### Schritt 7 – Testen

1. Öffne Telegram auf deinem Handy
2. Tailscale-App muss aktiv sein (grünes Symbol)
3. Suche deinen Bot (den Username den du bei BotFather vergeben hast)
4. Schreibe `Hallo`

Der Bot antwortet innerhalb weniger Sekunden. Fertig!

---

---

## Probleme?

**Bot antwortet nicht:**
```bash
docker compose logs -f openclaw
```
Logs live anschauen während du dem Bot schreibst.

**Container läuft nicht:**
```bash
docker compose down
docker compose up -d
```

**Tailscale getrennt:**
```bash
sudo tailscale up
```

---

## Nützliche Befehle

| Was | Befehl |
|-----|--------|
| Logs ansehen | `docker compose logs -f openclaw` |
| Neu starten | `docker compose restart openclaw` |
| Alles stoppen | `docker compose down` |
| Alles starten | `docker compose up -d` |
| Update | `git pull && docker compose up -d --build` |
