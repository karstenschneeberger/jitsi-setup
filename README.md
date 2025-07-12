# Jitsi-Setup

Dieses Repository enthält ein automatisiertes Installationsskript für einen DSGVO-konformen Jitsi Meet Server unter Debian 12.  
Es installiert Jitsi + NGINX + Firewall-Regeln + Systemoptimierung – ideal für Netcup SCP Custom Scripts.

## Quickstart (für Netcup SCP)

```bash
#!/bin/bash
wget -O /root/jitsi-setup.sh https://raw.githubusercontent.com/karstenschneeberger/jitsi-setup/master/jitsi-setup.sh
chmod +x /root/jitsi-setup.sh
bash /root/jitsi-setup.sh

```



## TLS-Zertifikat installieren (Let's Encrypt)

Nach erfolgreicher Ausführung von `jitsi-setup.sh` wird Jitsi zunächst mit einem selbstsignierten Zertifikat eingerichtet. Um HTTPS mit einem gültigen Let's Encrypt Zertifikat zu aktivieren, führe auf dem Server folgenden Befehl aus:

```bash
bash /usr/share/jitsi-meet/scripts/install-letsencrypt-cert.sh
```

Alternativ steht im Repository das Skript `install-letsencrypt-cert.sh` bereit, das dich vorab informiert und optional prüft, ob der Hostname korrekt aufgelöst wird:

```bash
wget -O /root/install-letsencrypt-cert.sh https://raw.githubusercontent.com/karstenschneeberger/jitsi-setup/master/install-letsencrypt-cert.sh
chmod +x /root/install-letsencrypt-cert.sh
bash /root/install-letsencrypt-cert.sh
```

**Hinweis:**

- Der Domainname (`meet.karstenschneeberger.de`) muss öffentlich erreichbar und im DNS korrekt gesetzt sein.
- Port 80 muss offen sein, da Let's Encrypt über HTTP-01 validiert.
- Das Zertifikat ist 90 Tage gültig und wird automatisch per `cron` oder `systemd` erneuert (je nach Jitsi-Version).