# Detaillierte Schritt-für-Schritt-Anleitung

> Für Intel NUC7i5 mit Ubuntu 24.04 LTS

---

## Inhaltsverzeichnis

1. [Vorbereitung: Accounts & Keys besorgen](#1-vorbereitung-accounts--keys-besorgen)
2. [Ubuntu auf dem NUC einrichten](#2-ubuntu-auf-dem-nuc-einrichten)
3. [SSH-Key einrichten (wichtig vor dem Härten!)](#3-ssh-key-einrichten)
4. [Repo klonen](#4-repo-klonen)
5. [Host-Setup ausführen](#5-host-setup-ausführen)
6. [.env Datei befüllen](#6-env-datei-befüllen)
7. [Tailscale verbinden](#7-tailscale-verbinden)
8. [Container starten](#8-container-starten)
9. [Telegram-Bot testen](#9-telegram-bot-testen)
10. [Alles prüfen – Checkliste](#10-alles-prüfen--checkliste)
11. [Häufige Fehler & Lösungen](#11-häufige-fehler--lösungen)
12. [Täglich nutzen](#12-täglich-nutzen)

---

## 1. Vorbereitung: Accounts & Keys besorgen

Bevor du anfängst, brauchst du vier Dinge. Bereite alles vor, bevor du den NUC anfasst.

### 1a. Anthropic API Key (für Claude)

1. Gehe zu [console.anthropic.com](https://console.anthropic.com)
2. Account erstellen oder einloggen
3. Links im Menü: **"API Keys"**
4. Klicke **"Create Key"**
5. Gib einen Namen ein, z.B. `nuc-openclaw`
6. Kopiere den Key – er sieht so aus:
   ```
   sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
   > Diesen Key siehst du nur einmal! Direkt in eine Textdatei kopieren.

7. Unter **"Billing"**: Guthaben aufladen (z.B. 5-10 €). Claude Sonnet kostet
   ca. 0,003 € pro Nachricht.

### 1b. Telegram Bot Token (via @BotFather)

1. Öffne Telegram auf deinem Handy oder PC
2. Suche nach `@BotFather` (der mit dem blauen Haken)
3. Tippe `/newbot` und sende es
4. BotFather fragt: **"Alright, a new bot. How are we going to call it?"**
   → Gib einen Anzeigenamen ein, z.B. `Mein NUC Assistent`
5. BotFather fragt: **"Now let's choose a username"**
   → Muss auf `_bot` enden, z.B. `mein_nuc_assistent_bot`
6. BotFather antwortet mit:
   ```
   Done! Congratulations on your new bot. You will find it at t.me/mein_nuc_assistent_bot.
   Use this token to access the HTTP API:

   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
   ```
7. Diesen Token kopieren und sicher aufbewahren.

### 1c. Deine Telegram User-ID herausfinden

OpenClaw soll nur mit DIR reden – dafür brauchst du deine numerische User-ID.

1. Suche in Telegram nach `@userinfobot`
2. Starte den Bot mit `/start`
3. Er antwortet sofort mit deiner ID:
   ```
   Your user id: 123456789
   ```
4. Diese Zahl notieren.

### 1d. Tailscale Account & Auth Key

1. Gehe zu [tailscale.com](https://tailscale.com) → **"Get started"**
2. Account erstellen (kostenlos, kein Kreditkarte nötig)
3. Nach dem Login: [login.tailscale.com/admin/settings/keys](https://login.tailscale.com/admin/settings/keys)
4. Klicke **"Generate auth key"**
5. Einstellungen:
   - **Reusable**: AN (damit der Container neu starten kann ohne neuen Key)
   - **Ephemeral**: AUS (damit der NUC im Tailnet bleibt)
   - **Expiry**: 90 Tage (oder "No expiry" für Dauerbetrieb)
   - **Tags**: leer lassen
6. Key generieren, sieht so aus:
   ```
   tskey-auth-XXXXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
7. Direkt kopieren – auch der wird nur einmal angezeigt.

---

## 2. Ubuntu auf dem NUC einrichten

### Ubuntu-Version prüfen

SSH in den NUC oder direkt am Gerät einloggen:

```bash
cat /etc/os-release
```

Erwartete Ausgabe (Ubuntu 24.04):
```
PRETTY_NAME="Ubuntu 24.04.1 LTS"
NAME="Ubuntu"
VERSION_ID="24.04"
```

Falls du noch kein Ubuntu hast:
→ [ubuntu.com/download/server](https://ubuntu.com/download/server) → Ubuntu 24.04 LTS ISO
→ Auf USB-Stick flashen (z.B. mit [balenaEtcher](https://etcher.balena.io))
→ NUC davon booten, Standardinstallation durchführen

### NUC für SSH vorbereiten

Am NUC direkt einloggen, dann:

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# SSH-Server sicherstellen
sudo apt install -y openssh-server
sudo systemctl enable --now ssh

# IP-Adresse des NUC herausfinden (für den nächsten Schritt)
ip addr show | grep "inet " | grep -v 127
```

Notiere die IP, z.B. `192.168.1.100`.

---

## 3. SSH-Key einrichten

> **Dieser Schritt MUSS vor dem Host-Setup passieren!**
> Das Host-Setup deaktiviert Passwort-Login. Danach kommst du nur noch
> per SSH-Key rein.

### Auf deinem PC/Mac (nicht auf dem NUC!):

```bash
# Prüfen ob du schon einen SSH-Key hast
ls ~/.ssh/id_*.pub
```

Falls kein Key vorhanden, einen erstellen:
```bash
ssh-keygen -t ed25519 -C "nuc-openclaw"
# Dreimal Enter drücken (kein Passwort nötig, oder eines vergeben)
```

Den Public Key auf den NUC kopieren:
```bash
ssh-copy-id dein-username@192.168.1.100
# Passwort des NUC-Users eingeben (zum letzten Mal!)
```

Verbindung testen (muss ohne Passwort funktionieren):
```bash
ssh dein-username@192.168.1.100
# Du solltest ohne Passwort-Prompt reinkommen
```

---

## 4. Repo klonen

Auf dem NUC (via SSH oder direkt):

```bash
# git installieren falls nötig
sudo apt install -y git

# Repo klonen
git clone https://github.com/Majorr77/openclaw.git
cd openclaw

# Dateien prüfen
ls -la
```

Erwartete Ausgabe:
```
.env.example
.gitignore
Dockerfile
README.md
config/
docker-compose.yml
scripts/
```

---

## 5. Host-Setup ausführen

```bash
sudo bash scripts/setup-host.sh
```

Das Skript läuft ca. 2-5 Minuten. Es installiert:
- **Docker** (Container-Runtime)
- **UFW** (Firewall: alles blockiert außer SSH und Tailscale)
- **Fail2Ban** (sperrt IPs nach 3 falschen SSH-Versuchen für 1 Stunde)
- **Automatische Sicherheitsupdates**

Erwartete Ausgabe am Ende:
```
[OK]   Docker installiert: Docker version 27.x.x
[OK]   Docker Daemon gesichert
[OK]   UFW aktiv: Status: active
[OK]   Fail2Ban aktiv
[OK]   Automatische Updates aktiviert
[OK]   SSH gehärtet (nur Public-Key-Auth, kein Root-Login)

Host-Setup abgeschlossen!
```

### Verbindung nach dem Host-Setup testen

Öffne ein **neues Terminal** (altes SSH offen lassen!) und teste:

```bash
ssh dein-username@192.168.1.100
```

Klappt der Login ohne Passwort? Wenn ja: alles gut.
Klappt er nicht: Überprüfe Schritt 3 (SSH-Key).

---

## 6. .env Datei befüllen

```bash
# Vorlage kopieren
cp .env.example .env

# Dateirechte einschränken (nur dein User kann lesen)
chmod 600 .env

# Bearbeiten
nano .env
```

Die Datei sieht so aus – ersetze alle Platzhalter:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-DEIN_ECHTER_KEY
TELEGRAM_BOT_TOKEN=1234567890:DEIN_ECHTER_TOKEN
TELEGRAM_ALLOWED_USERS=123456789
TS_AUTHKEY=tskey-auth-DEIN_ECHTER_KEY
```

Speichern: `Strg+O` → Enter → `Strg+X`

Prüfen ob alles drin ist:
```bash
grep -c "DEIN" .env
```
Sollte `0` ausgeben (alle Platzhalter ersetzt).

---

## 7. Tailscale verbinden

```bash
sudo bash scripts/setup-tailscale.sh
```

Das Skript:

1. Installiert Tailscale
2. Startet `tailscale up` – du siehst einen Link:
   ```
   To authenticate, visit:
   https://login.tailscale.com/a/XXXXXXXX
   ```
3. Öffne diesen Link auf deinem PC/Handy in einem Browser
4. Mit deinem Tailscale-Account bestätigen
5. Das Terminal auf dem NUC bestätigt die Verbindung:
   ```
   [OK]   Tailscale verbunden
   ```

### Tailscale-Verbindung prüfen

```bash
tailscale status
```

Erwartete Ausgabe:
```
100.x.x.x   openclaw-nuc   dein@email.de  linux   -
```

```bash
tailscale ip
```
Gibt deine Tailscale-IP aus, z.B. `100.88.42.10`.

### Tailscale auf deinem Handy/PC installieren

Damit du vom Handy auf den NUC zugreifen kannst:

1. [tailscale.com/download](https://tailscale.com/download) → App für dein Gerät
2. Mit demselben Account einloggen
3. Im Tailscale-App siehst du jetzt `openclaw-nuc` in der Geräteliste

---

## 8. Container starten

```bash
# Im openclaw-Verzeichnis:
docker compose up -d
```

Beim **ersten Start** wird das Image gebaut – das dauert 2-4 Minuten.
Du siehst so etwas wie:

```
[+] Building 45.3s (12/12) FINISHED
[+] Running 2/2
 ✔ Container openclaw-tailscale  Started
 ✔ Container openclaw-app        Started
```

### Status prüfen

```bash
docker compose ps
```

Erwartete Ausgabe (beide Container `running`):
```
NAME                  IMAGE               STATUS          PORTS
openclaw-app          openclaw-app        Up 2 minutes
openclaw-tailscale    tailscale/tailscale Up 2 minutes
```

### Logs ansehen

```bash
# OpenClaw Logs
docker compose logs --tail=50 openclaw

# Tailscale Logs (im Container)
docker compose logs --tail=20 tailscale
```

Normaler OpenClaw-Start sieht so aus:
```
[openclaw] Gateway starting on 0.0.0.0:18789
[openclaw] Telegram channel connected
[openclaw] Ready. Listening for messages...
```

### Gateway von innen testen

```bash
docker compose exec openclaw curl -s http://127.0.0.1:18789/health
```

Sollte `{"status":"ok"}` oder ähnliches ausgeben.

---

## 9. Telegram-Bot testen

1. Öffne Telegram auf deinem Handy
2. Stelle sicher, dass Tailscale auf deinem Handy aktiv ist (grünes Symbol)
3. Suche nach deinem Bot (dem Username den du bei BotFather vergeben hast)
4. Schreibe `/start` oder einfach `Hallo`

Der Bot sollte innerhalb weniger Sekunden antworten.

### Was passiert wenn es nicht klappt?

```bash
# Logs live beobachten während du dem Bot schreibst:
docker compose logs -f openclaw
```

Du solltest bei einer eingehenden Nachricht eine neue Log-Zeile sehen.

---

## 10. Alles prüfen – Checkliste

Führe diese Befehle nacheinander aus und prüfe die Ergebnisse:

```bash
# 1. Docker Container laufen?
docker compose ps
# → beide Container: Status "Up"

# 2. Tailscale verbunden?
tailscale status
# → openclaw-nuc taucht auf

# 3. Firewall aktiv?
sudo ufw status verbose
# → Status: active, nur Port 22/tcp (Tailscale) und 41641/udp offen

# 4. Fail2Ban aktiv?
sudo systemctl status fail2ban
# → Active: active (running)

# 5. Automatische Updates aktiv?
sudo systemctl status unattended-upgrades
# → Active: active

# 6. .env nicht in Git?
git status
# → .env darf NICHT erscheinen (steht in .gitignore)

# 7. Tailscale Serve konfiguriert?
tailscale serve status
# → Zeigt HTTPS-Endpunkt auf Port 18789
```

---

## 11. Häufige Fehler & Lösungen

### "docker: command not found"

```bash
# Docker neu installieren
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl start docker
```

### "permission denied" beim docker-Befehl

```bash
# User zur docker-Gruppe hinzufügen, dann neu einloggen
sudo usermod -aG docker $USER
# Ausloggen und wieder einloggen!
```

### Tailscale verbindet sich nicht (Auth-Link öffnet sich nicht)

```bash
# Auth-Link manuell anfordern
sudo tailscale up --authkey $(grep TS_AUTHKEY .env | cut -d= -f2)
```

### Bot antwortet nicht

Checkliste:
1. Ist der `TELEGRAM_BOT_TOKEN` exakt kopiert? (keine Leerzeichen)
2. Ist deine User-ID korrekt in `TELEGRAM_ALLOWED_USERS`?
3. Läuft der Container? → `docker compose ps`
4. Logs prüfen → `docker compose logs -f openclaw`

### "Error: invalid token" (Anthropic)

```bash
# Key in .env prüfen
grep ANTHROPIC_API_KEY .env

# Key muss mit sk-ant- anfangen und kein Leerzeichen enthalten
```

### Container startet immer wieder neu (Restart-Loop)

```bash
# Detaillierten Fehler ansehen
docker compose logs --tail=100 openclaw
```

Häufige Ursachen:
- Falscher API Key → in `.env` korrigieren → `docker compose up -d --force-recreate`
- Port 18789 schon belegt → `sudo ss -tlnp | grep 18789`

### SSH-Verbindung nach Host-Setup verloren

Falls du dich ausgesperrt hast:
- Schließe NUC direkt an Monitor und Tastatur an
- Login mit Passwort direkt am Gerät
- `sudo nano /etc/ssh/sshd_config.d/99-hardening.conf`
- `PasswordAuthentication no` → `yes` ändern, temporär
- `sudo systemctl restart sshd`
- SSH-Key korrekt einrichten (Schritt 3), dann wieder auf `no` setzen

---

## 12. Täglich nutzen

### Bot täglich nutzen
Einfach Telegram öffnen und mit deinem Bot schreiben – das war's.

### NUC neu starten
Die Container starten automatisch nach einem Neustart
(`restart: unless-stopped` im docker-compose.yml).

```bash
sudo reboot
# Nach ~1 Minute ist alles wieder online
```

### Logs prüfen (z.B. bei Problemen)
```bash
docker compose logs -f --tail=50 openclaw
```

### OpenClaw updaten
```bash
cd ~/openclaw
git pull
docker compose up -d --build
```

### Alles stoppen
```bash
docker compose down
```

### Tailscale temporär trennen
```bash
sudo tailscale down
# Wieder verbinden:
sudo tailscale up
```

---

## Sicherheits-Erinnerungen

- **`.env` niemals** in Git pushen oder teilen
- **Tailscale Auth Key** gilt als Geheimnis – nicht weitergeben
- **Anthropic API Key** hat Kosten – Verbrauch unter [console.anthropic.com](https://console.anthropic.com) im Auge behalten
- Monatlich prüfen: `sudo apt update && sudo apt upgrade -y` (falls auto-updates ausfallen)
- Logs gelegentlich auf ungewöhnliche Aktivitäten prüfen

---

*Fragen oder Probleme? Öffne ein Issue im Repository.*
