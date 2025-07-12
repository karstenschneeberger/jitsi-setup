# Jitsi-Setup

Dieses Repository enthält ein automatisiertes Installationsskript für einen DSGVO-konformen Jitsi Meet Server unter Debian 12.  
Es installiert Jitsi + NGINX + Firewall-Regeln + Systemoptimierung – ideal für Netcup SCP Custom Scripts.

## Quickstart (für Netcup SCP)

```bash
#!/bin/bash
wget -O /root/jitsi-setup.sh https://raw.githubusercontent.com/karstenschneeberger/jitsi-setup/master/jitsi-setup.sh
chmod +x /root/jitsi-setup.sh
bash /root/jitsi-setup.sh
