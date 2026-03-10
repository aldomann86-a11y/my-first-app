/* ===================================================
   Hofhelfer KI – App-Logik
   Simulierte KI-Ausgabe ohne externe APIs
   =================================================== */

// n8n Webhook-URL für Notion-Speicherung
const WEBHOOK_URL = 'https://n8n.atsobl.ch/webhook/hofhelfer-notiz';
const WEBHOOK_AUTH = 'Basic ' + btoa('hofhelfer:HofHelfer2024!');

// Aktueller Ausgabe-Typ (wird bei showOutput gesetzt)
let currentOutputType = null;

// Alle Aktions-Buttons (nicht der Kopieren- oder Mikrofon-Button)
const buttons = document.querySelectorAll('button:not(.btn-copy):not(.btn-mic)');

/* ---- Spracheingabe ---- */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const textarea = document.getElementById('user-input');
    textarea.value = textarea.value ? textarea.value + ' ' + transcript : transcript;
    setMicState(false);
  };

  recognition.onerror = () => setMicState(false);
  recognition.onend  = () => setMicState(false);
}

function toggleSpeech() {
  if (!recognition) {
    alert('Dein Browser unterstützt leider keine Spracheingabe.\nBitte verwende Chrome oder Edge.');
    return;
  }
  if (isListening) {
    recognition.stop();
  } else {
    recognition.start();
    setMicState(true);
  }
}

function setMicState(listening) {
  isListening = listening;
  const btn = document.getElementById('btn-mic');
  btn.innerHTML = listening ? '<span class="mic-dot"></span> Aufnahme läuft…' : '🎤 Sprechen';
  btn.classList.toggle('listening', listening);
}

/* ---- Lade-Zustand ---- */

/**
 * Aktiviert/deaktiviert den Lade-Zustand der Buttons.
 * @param {boolean} active - true = laden, false = fertig
 */
function setLoading(active) {
  buttons.forEach(btn => {
    btn.disabled = active;
    if (active) {
      // Original-HTML sichern
      btn.dataset.originalHtml = btn.innerHTML;
      // Nur beim geklickten Button Spinner zeigen
      if (btn.dataset.loading === 'true') {
        btn.innerHTML = '<span class="spinner"></span>';
      }
    } else {
      // Original-HTML wiederherstellen
      if (btn.dataset.originalHtml) {
        btn.innerHTML = btn.dataset.originalHtml;
      }
      delete btn.dataset.loading;
    }
  });
}

/* ---- Haupt-Handler ---- */

/**
 * Wird aufgerufen, wenn E-Mail / Notiz / Ideen geklickt wird.
 * @param {'email'|'notiz'|'ideen'} type
 */
function handleAction(type) {
  const input = document.getElementById('user-input').value.trim();
  const validationMsg = document.getElementById('validation-msg');

  // Eingabe prüfen
  if (!input) {
    validationMsg.classList.add('visible');
    document.getElementById('user-input').focus();
    return;
  }
  validationMsg.classList.remove('visible');

  // Geklickten Button als "ladend" markieren
  const btn = document.querySelector(`.btn-${type}`);
  btn.dataset.loading = 'true';
  setLoading(true);

  // Kurze Verzögerung simuliert KI-Verarbeitung
  setTimeout(() => {
    const result = generate(type, input);
    showOutput(type, result);
    setLoading(false);
  }, 800);
}

/* ---- Text-Generierung ---- */

/**
 * Hauptfunktion: delegiert an die passende Generator-Funktion.
 */
function generate(type, text) {
  const topic    = extractTopic(text);
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

  if (type === 'email') return generateEmail(text, topic, sentences);
  if (type === 'notiz') return generateNotiz(text, topic, sentences);
  if (type === 'ideen') return generateIdeen(text, topic);
}

/**
 * Extrahiert die ersten ~5 Wörter als Thema-Hinweis.
 */
function extractTopic(text) {
  return text.split(/\s+/).slice(0, 5).join(' ');
}

/**
 * Erstellt eine kurze geschäftliche E-Mail auf Deutsch.
 */
function generateEmail(text, topic, sentences) {
  const body = sentences.length > 1
    ? sentences.map(s => s.charAt(0).toUpperCase() + s.slice(1) + '.').join(' ')
    : text.charAt(0).toUpperCase() + text.slice(1) + '.';

  return [
    'Guten Tag,',
    '',
    'ich möchte mich mit folgendem Anliegen an Sie wenden:',
    '',
    body,
    '',
    'Ich würde mich freuen, wenn wir dies zeitnah besprechen könnten.' +
    ' Für Rückfragen stehe ich gerne zur Verfügung.',
    '',
    'Mit freundlichen Grüßen',
    '[Dein Name]',
  ].join('\n');
}

/**
 * Formatiert den Text als strukturierte Arbeitsnotiz.
 */
function generateNotiz(text, topic, sentences) {
  const points = sentences.length >= 2
    ? sentences.map(s => `• ${s.charAt(0).toUpperCase() + s.slice(1)}.`)
    : text.split(',').map(s => `• ${s.trim().charAt(0).toUpperCase() + s.trim().slice(1)}.`);

  const datum = new Date().toLocaleDateString('de-DE');

  return [
    '📋 ARBEITSNOTIZ',
    '─'.repeat(30),
    `Thema:  ${topic}...`,
    `Datum:  ${datum}`,
    '',
    'Kernpunkte:',
    ...points,
    '',
    'Nächste Schritte:',
    '• Zuständige Person informieren',
    '• Termin festlegen',
    '• Ergebnis dokumentieren',
    '',
    'Priorität:  ☐ Hoch  ☐ Mittel  ☑ Normal',
  ].join('\n');
}

/**
 * Erstellt 5 einfache Ideen zum eingegebenen Thema.
 */
function generateIdeen(text, topic) {
  const ideen = [
    `Erstelle eine Checkliste für „${topic}…" um nichts zu vergessen.`,
    'Bespreche das Thema in der nächsten Teambesprechung und hole Feedback ein.',
    'Dokumentiere den aktuellen Stand schriftlich für zukünftige Referenz.',
    'Prüfe, ob es bestehende Vorlagen oder Prozesse gibt, die du nutzen kannst.',
    'Setze eine konkrete Deadline und teile die Aufgabe in kleinere Schritte auf.',
  ];

  return [
    '💡 5 IDEEN & VORSCHLÄGE',
    '─'.repeat(30),
    `Thema: ${topic}…`,
    '',
    ...ideen.map((id, i) => `${i + 1}. ${id}`),
  ].join('\n\n').replace(/\n\n(\d)/g, '\n\n$1'); // sauberer Abstand
}

/* ---- Ausgabe anzeigen ---- */

/**
 * Zeigt das Ergebnis im Ausgabe-Bereich an.
 */
function showOutput(type, content) {
  const card       = document.getElementById('output-card');
  const badge      = document.getElementById('output-badge');
  const outputText = document.getElementById('output-text');

  const config = {
    email: { label: '✉️ E-Mail', cls: 'badge-email' },
    notiz: { label: '📋 Notiz',  cls: 'badge-notiz' },
    ideen: { label: '💡 Ideen',  cls: 'badge-ideen' },
  }[type];

  badge.textContent = config.label;
  badge.className   = `output-badge ${config.cls}`;
  outputText.textContent = content;
  currentOutputType = type;

  card.classList.add('visible');
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---- Kopieren ---- */

/**
 * Kopiert den generierten Text in die Zwischenablage.
 */
function copyOutput() {
  const text = document.getElementById('output-text').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.btn-copy');
    btn.textContent = 'Kopiert ✓';
    setTimeout(() => { btn.textContent = 'Kopieren'; }, 2000);
  });
}

/* ---- Notion-Speicherung ---- */

/**
 * Sendet die aktuelle Ausgabe an Notion via n8n-Webhook.
 */
async function saveToNotion() {
  const text = document.getElementById('output-text').textContent;
  const btn = document.querySelector('.btn-save');

  if (!text || !currentOutputType) return;

  const typMap = { email: 'E-Mail', notiz: 'Notiz', ideen: 'Idee' };

  btn.disabled = true;
  btn.textContent = '⏳ Speichern…';

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': WEBHOOK_AUTH },
      body: JSON.stringify({
        notiz: text,
        typ: typMap[currentOutputType] || 'Notiz',
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    btn.textContent = '✅ Gespeichert';
    setTimeout(() => { btn.textContent = '💾 Speichern'; btn.disabled = false; }, 2500);
  } catch (err) {
    console.error('[App] Notion-Speicherung fehlgeschlagen:', err);
    btn.textContent = '❌ Fehler';
    setTimeout(() => { btn.textContent = '💾 Speichern'; btn.disabled = false; }, 2500);
  }
}
