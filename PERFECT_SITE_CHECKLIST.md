# Piano Completo: cosa rimuovere, aggiungere e migliorare per avere un sito “top”

Questo documento traduce lo stato attuale del progetto in azioni concrete, ordinate per priorità.

## 0) Priorità immediata (prima di ogni altra cosa)

1. **Correggere bug/blocker backend**
   - In `server.js` c'è un controllo con una chiave Gemini scritta come identificatore non definito (`if (AIza...)`) che può generare errore a runtime.
2. **Sostituire placeholder di tracking/form**
   - GA usa un ID placeholder (`G-1A2B3C4D5E`) e il form punta a un endpoint demo (`f/xyzabc123`).
3. **Ridurre superfici XSS lato frontend**
   - Evitare `innerHTML` quando non necessario e ridurre l'uso di `onclick` inline.

---

## 1) Cosa rimuovere (o ridurre)

## A. Da rimuovere subito
- **Placeholder e dati fittizi in produzione**
  - Google Analytics placeholder
  - Formspree placeholder
  - Email di default nella thank-you page (`email@example.com`) come fallback pubblico

- **Codice/feature non integrata**
  - `language-switcher.html` è scollegato dalla UX reale del sito e crea confusione architetturale.

## B. Da ridurre progressivamente
- **Dipendenza da CDN critiche in runtime** (Tailwind CDN, font, icone) senza fallback locale.
- **JavaScript inline negli attributi HTML** (`onclick`) da spostare in listeners centralizzati.
- **Duplicazione logica policy/cookie** da centralizzare in modulo unico.

---

## 2) Cosa aggiungere

## A. SEO tecnico
- `sitemap.xml`, `robots.txt`, `canonical` coerenti e verificati.
- JSON-LD (`Organization`, `WebSite`, `Service`).
- Open Graph/Twitter card con asset reali ottimizzati (non placeholder).
- Pagine dedicate per intent commerciali (servizi, prezzi, casi studio, FAQ, contatti).

## B. Performance
- Build CSS/JS (niente Tailwind CDN in produzione).
- Minificazione, compressione Brotli/Gzip, lazy loading media.
- Ottimizzazione Core Web Vitals (LCP/CLS/INP) con monitoraggio reale (RUM).

## C. Conversione (CRO)
- CTA principale unica e ripetuta in punti strategici.
- A/B test su headline, social proof, form length.
- Trust signals: recensioni verificabili, case study con metriche, loghi clienti reali.
- Calendario call (es. Calendly) con eventi analytics.

## D. Accessibilità
- Audit WCAG 2.2 AA completo.
- Focus states robusti, label esplicite, semantica heading pulita.
- Migliorie per tastiera/screen reader su menu, modali e cards interattive.

## E. Sicurezza e compliance
- Content Security Policy (CSP) rigorosa.
- Rate limiting e anti-spam (honeypot + captcha invisibile).
- Validazioni server-side consistenti + sanitizzazione input.
- Privacy/cookie con categorizzazione consensi e blocco script non essenziali fino ad opt-in.

## F. Prodotto e brand
- Posizionamento unico chiaro in hero (chi siete, per chi, risultato misurabile).
- Pacchetti/prezzi trasparenti con range e SLA.
- Processo in 3 step + tempi + deliverable.
- Sezione “Perché noi” con differenziatori concreti.

---

## 3) Cosa migliorare (by area)

## A. Struttura contenuti
- Ridurre claim generici (“50+ strumenti AI”) e aumentare prova concreta.
- Migliorare hierarchy copy: hero -> problemi -> soluzione -> prova -> CTA.
- Uniformare tono di voce (più orientato al risultato business).

## B. Form e funnel
- Snellire campi iniziali, usare progressive profiling.
- Aggiungere microcopy di fiducia vicino alla CTA.
- Migliorare thank-you page con prossimo step concreto (data, canale, tempo).

## C. Frontend engineering
- Separare HTML/CSS/JS in file modulari.
- Ridurre script inline e usare componentizzazione.
- Gestire stato UI (modali, filtri, cookie) con pattern consistente.

## D. Backend/API
- Correggere la logica Gemini e fallback.
- Logging strutturato + error monitoring (Sentry o equivalente).
- Hardening CORS e coerenza header sicurezza.
- Healthcheck endpoint e readiness checks.

## E. DevOps
- Pipeline CI con lint + test + Lighthouse CI.
- Ambienti distinti (dev/staging/prod) e variabili segregate.
- Versionamento release + changelog.

---

## 4) Piano operativo (90 giorni)

## Fase 1 (Settimane 1-2) — Stabilità & fiducia
- Fix bug critici backend.
- Rimozione placeholder e verifica form end-to-end.
- Setup monitoraggio errori e analytics reali.
- Revisione privacy/cookie consent reale.

## Fase 2 (Settimane 3-6) — Performance & SEO
- Migrazione da CDN runtime a build statica.
- Ottimizzazione Core Web Vitals.
- Implementazione sitemap/robots/schema + content pages.

## Fase 3 (Settimane 7-10) — Conversione
- Ridisegno hero/CTA.
- Inserimento case study/testimonianze.
- A/B test funnel e form.

## Fase 4 (Settimane 11-12) — Scala
- QA accessibilità completa.
- Hardening sicurezza.
- Dashboard KPI con obiettivi trimestrali.

---

## 5) KPI da monitorare (obbligatori)

- Conversion rate visite -> lead
- Lead qualificati (% MQL)
- CPL (costo per lead)
- Tempo medio di risposta ai lead
- Core Web Vitals (LCP, CLS, INP)
- Ranking pagine money-keyword
- Tasso di rimbalzo pagine chiave

---

## 6) Definizione pratica di “sito perfetto”

Un sito “perfetto” non è quello più bello, ma quello che:
1. è **veloce**,
2. è **credibile**,
3. è **facile da usare**,
4. è **sicuro/compliant**,
5. converte traffico in **opportunità commerciali misurabili**.

Questo piano è pensato per arrivarci in modo concreto, senza rifacimenti inutili.
