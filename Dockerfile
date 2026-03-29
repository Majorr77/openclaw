# =============================================================================
# OpenClaw – Hardened Container Image
# Node 24 Alpine, non-root user, minimale Angriffsfläche
# =============================================================================
FROM node:24-alpine AS installer

# pnpm für schnellere, reproduzierbare Installs
RUN npm install -g pnpm@latest --quiet

# OpenClaw installieren (global, damit alle Binaries verfügbar sind)
RUN npm install -g openclaw@latest --quiet

# =============================================================================
FROM node:24-alpine AS runtime

LABEL maintainer="openclaw-nuc-setup"
LABEL description="OpenClaw AI Assistant – secure container for Intel NUC"

# Sicherheits-relevante Pakete (curl für Healthcheck)
RUN apk add --no-cache curl tini

# Dedizierter non-root User
RUN addgroup -S -g 1001 openclaw \
 && adduser  -S -u 1001 -G openclaw -H -h /home/openclaw openclaw \
 && mkdir -p /home/openclaw \
 && chown openclaw:openclaw /home/openclaw

# Node-Globals aus dem Installer-Stage kopieren
COPY --from=installer /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=installer /usr/local/bin/openclaw     /usr/local/bin/openclaw

# OpenClaw Config-Verzeichnis (wird per Volume überschrieben)
RUN mkdir -p /home/openclaw/.openclaw \
 && chown -R openclaw:openclaw /home/openclaw/.openclaw

# Nur als non-root User ausführen
USER openclaw
WORKDIR /home/openclaw

# OpenClaw Gateway Port (intern – NICHT nach außen mappen!
# Der Zugriff erfolgt ausschließlich über den Tailscale-Sidecar.)
EXPOSE 18789

# tini als Init-Prozess (sauberes Signal-Handling, kein Zombie-Problem)
ENTRYPOINT ["/sbin/tini", "--"]

# Healthcheck über den Gateway-Endpunkt
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -sf http://127.0.0.1:18789/health || exit 1

CMD ["openclaw", "gateway", "--host", "0.0.0.0", "--port", "18789"]
