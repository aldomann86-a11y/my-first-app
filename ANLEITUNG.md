# Hofhelfer KI – Deployment-Anleitung

## 1. App auf einen Server hochladen

### Option A: Netlify Drop (empfohlen, kostenlos, 1 Minute)
1. Gehe zu **https://app.netlify.com/drop**
2. Ziehe den gesamten `HofhelferKI`-Ordner per Drag & Drop ins Browser-Fenster
3. Netlify generiert sofort eine öffentliche URL (z. B. `https://dein-name.netlify.app`)
4. Fertig – die App ist online!

### Option B: GitHub Pages (kostenlos)
1. Erstelle ein neues Repository auf GitHub (z. B. `hofhelfer-ki`)
2. Lade alle Dateien hoch (`index.html`, `styles.css`, `app.js`, `manifest.json`,
   `service-worker.js`, `icon-192.svg`, `icon-512.svg`)
3. Gehe zu **Settings → Pages → Source → main branch → / (root)**
4. URL wird: `https://dein-username.github.io/hofhelfer-ki`

### Option C: Beliebiger statischer Webserver
- Alle Dateien per FTP/SFTP in ein öffentliches Verzeichnis hochladen
- **Wichtig:** Die App muss über **HTTPS** erreichbar sein, damit PWA-Features funktionieren

---

## 2. QR-Code erstellen

1. Gehe zu **https://goqr.me** oder **https://www.qr-code-generator.com**
2. Wähle „URL" als Inhalt
3. Gib deine App-URL ein (z. B. `https://dein-name.netlify.app`)
4. Klicke auf „Generate" / „Erstellen"
5. QR-Code als PNG herunterladen und in Präsentation einfügen oder ausdrucken

---

## 3. App auf dem Handy installieren

### Android (Chrome / Edge)
- Die App auf dem Handy öffnen
- Chrome zeigt automatisch einen Banner „Zum Startbildschirm hinzufügen" an
- Alternativ: Menü (⋮) → „Zum Startbildschirm hinzufügen" oder „App installieren"
- Bestätigen – die App erscheint wie eine native App auf dem Homescreen

### iOS (Safari)
- Die App in **Safari** öffnen (kein Chrome, kein Firefox!)
- Auf das **Teilen-Symbol** tippen (Quadrat mit Pfeil nach oben)
- Nach unten scrollen → „**Zum Home-Bildschirm**" auswählen
- Namen bestätigen → „Hinzufügen"
- Die App erscheint auf dem Homescreen und öffnet sich ohne Browser-UI

---

## Hinweise

- Die App benötigt nach der ersten Öffnung **kein Internet mehr** (Offline-fähig dank Service Worker)
- HTTPS ist Pflicht für PWA-Installierbarkeit (Netlify & GitHub Pages liefern das automatisch)
- Icons: Die SVG-Icons funktionieren in modernen Browsern. Für ältere iOS-Versionen
  können zusätzlich PNG-Icons erstellt werden (z. B. mit https://realfavicongenerator.net)
