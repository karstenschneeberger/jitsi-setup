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
/usr/share/jitsi-meet/scripts/install-letsencrypt-cert.sh
```

**Hinweis:**

- Der Domainname (`meet.karstenschneeberger.de`) muss öffentlich erreichbar und im DNS korrekt gesetzt sein.
- Port 80 muss offen sein, da Let's Encrypt über HTTP-01 validiert.
- Das Zertifikat ist 90 Tage gültig und wird automatisch per `cron` oder `systemd` erneuert (je nach Jitsi-Version).

### TLS-Zertifikat erneuern & prüfen

Die Let's Encrypt Zertifikate sind jeweils **90 Tage gültig**. Die automatische Erneuerung erfolgt im Hintergrund über den `certbot`, sobald das Zertifikat ca. 30 Tage vor Ablauf steht.

#### Manuelles Testen der Erneuerung

Um zu prüfen, ob das automatische Renewal grundsätzlich funktioniert, kann folgender Befehl verwendet werden:

```bash
certbot renew --dry-run
```
Dieser testet den Ablauf ohne echte Verlängerung. Bei funktionierender Konfiguration sollte keine Fehlermeldung erscheinen. Mögliche Ausgabe:

```yaml
No simulated renewals were attempted.
```

Das ist normal, wenn das Zertifikat noch zu neu ist.

#### Automatisches Renewal prüfen

Ob ein systemd timer oder Cronjob aktiv ist, lässt sich mit folgendem Befehl prüfen:

```bash
systemctl list-timers | grep certbot
```

Oder per Logdatei:

```bash
cat /var/log/letsencrypt/letsencrypt.log
```