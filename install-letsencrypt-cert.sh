#!/bin/bash
set -e

# Prüfen, ob Domain auf die IP zeigt (optional)
if ! host "$(hostname -f)" | grep -q "$(hostname -I | awk '{print $1}')"; then
  echo "WARNUNG: Hostname zeigt nicht auf aktuelle IP – Zertifikat könnte fehlschlagen."
  echo "Drücke Strg+C zum Abbrechen oder Enter zum Fortfahren..."
  read
fi

# Interaktives Let’s Encrypt-Skript von Jitsi starten
echo "Starte Let's Encrypt Zertifikatsinstallation..."
/usr/share/jitsi-meet/scripts/install-letsencrypt-cert.sh
