# AxsenWebsite AI - Guida Completa di Setup e Deployment

## 📋 Indice
1. [Requisiti](#requisiti)
2. [Installazione Locale](#installazione-locale)
3. [Configurazione Variabili d'Ambiente](#configurazione-variabili-dambiente)
4. [Esecuzione in Locale](#esecuzione-in-locale)
5. [Deployment su Netlify](#deployment-su-netlify)
6. [Deployment su Vercel](#deployment-su-vercel)
7. [Installazione su Smartphone](#installazione-su-smartphone)
8. [Troubleshooting](#troubleshooting)

---

## Requisiti

- **Node.js** v16+ ([Scarica qui](https://nodejs.org/))
- **npm** o **yarn** (incluso con Node.js)
- **Git** ([Scarica qui](https://git-scm.com/))
- Account su **Netlify** o **Vercel** (gratuiti)

---

## Installazione Locale

### 1. Clonare il Repository
```bash
git clone https://github.com/AxsenXzc/axsenwebsite.git
cd axsenwebsite
```

### 2. Installare le Dipendenze
```bash
npm install
```

---

## Configurazione Variabili d'Ambiente

### 1. Creare il File `.env`
Crea un file `.env` nella root del progetto:

```bash
cp .env.example .env
```

### 2. Compilare le Variabili

**Per il Backend:**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/axsenwebsite
JWT_SECRET=your_super_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
GEMINI_API_KEY=your_google_gemini_api_key
```

**Per il Frontend:**
```env
REACT_APP_SITE_NAME=AxsenWebsite
REACT_APP_SITE_URL=http://localhost:3000
REACT_APP_GA_ID=G-1A2B3C4D5E
```

### 3. Ottenere le API Keys

#### Gmail SMTP (per Email)
1. Vai a [Google Account Security](https://myaccount.google.com/security)
2. Abilita "2-Step Verification"
3. Genera una "App Password"
4. Copia il codice in `EMAIL_PASS`

#### Google Gemini API
1. Vai a [Google AI Studio](https://aistudio.google.com/)
2. Crea una nuova chiave API
3. Copia in `GEMINI_API_KEY`

---

## Esecuzione in Locale

### Opzione 1: Solo Frontend (Sviluppo Rapido)
```bash
npm run client
```
Accedi a `http://localhost:8000`

### Opzione 2: Backend + Frontend (Completo)
```bash
npm start
```
Accedi a `http://localhost:3000`

---

## Deployment su Netlify

### Metodo 1: Tramite GitHub (Consigliato)

1. **Collegare il Repository**
   - Vai a [Netlify](https://netlify.com)
   - Clicca "New site from Git"
   - Seleziona "GitHub" e autorizza
   - Seleziona il repository `axsenwebsite`

2. **Configurare le Impostazioni di Build**
   - **Build command**: `npm run build` (o lascia vuoto per sito statico)
   - **Publish directory**: `.` (root)

3. **Aggiungere le Variabili d'Ambiente**
   - Vai a "Site settings" → "Build & deploy" → "Environment"
   - Aggiungi tutte le variabili da `.env`

4. **Deployer**
   - Clicca "Deploy site"
   - Attendi il completamento

### Metodo 2: Tramite Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## Deployment su Vercel

### Metodo 1: Tramite Dashboard (Consigliato)

1. **Collegare il Repository**
   - Vai a [Vercel](https://vercel.com)
   - Clicca "New Project"
   - Seleziona "Import Git Repository"
   - Seleziona il repository `axsenwebsite`

2. **Configurare le Impostazioni**
   - **Framework Preset**: "Other"
   - **Build Command**: Lascia vuoto (sito statico)
   - **Output Directory**: `.`

3. **Aggiungere le Variabili d'Ambiente**
   - Nella sezione "Environment Variables"
   - Aggiungi tutte le variabili da `.env`

4. **Deployer**
   - Clicca "Deploy"
   - Attendi il completamento

### Metodo 2: Tramite Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Installazione su Smartphone

### iOS (iPhone/iPad)

1. **Apri il Sito in Safari**
   - Accedi a `https://axsenwebsite.com` (o il tuo dominio)

2. **Aggiungi alla Home**
   - Tocca il pulsante "Condividi" (quadrato con freccia)
   - Scorri e seleziona "Aggiungi alla schermata Home"
   - Scegli un nome e tocca "Aggiungi"

3. **L'App Apparirà sulla Home**
   - Tocca l'icona per aprire l'app

### Android

1. **Apri il Sito in Chrome**
   - Accedi a `https://axsenwebsite.com` (o il tuo dominio)

2. **Installa l'App**
   - Tocca il menu (tre puntini in alto a destra)
   - Seleziona "Installa app"
   - Conferma

3. **L'App Apparirà nella Schermata Home**
   - Tocca l'icona per aprire l'app

### Funzionalità PWA
- ✅ Funziona offline
- ✅ Accesso rapido dalla home
- ✅ Icona personalizzata
- ✅ Notifiche push (se configurate)

---

## Troubleshooting

### Problema: "Cannot find module 'express'"
**Soluzione:**
```bash
npm install
```

### Problema: "PORT 3000 is already in use"
**Soluzione:**
```bash
# Cambia porta in .env
PORT=3001
```

### Problema: "Email non inviata"
**Soluzione:**
1. Verifica le credenziali Gmail in `.env`
2. Assicurati che "2-Step Verification" sia abilitato
3. Usa una "App Password" non la password normale

### Problema: "Sito non carica su Netlify"
**Soluzione:**
1. Verifica che `netlify.toml` sia presente
2. Controlla i log di build in Netlify
3. Assicurati che `.env` sia configurato

### Problema: "PWA non si installa"
**Soluzione:**
1. Verifica che `manifest.json` sia presente
2. Controlla che il sito sia su HTTPS (non HTTP)
3. Ricarica la pagina e riprova

---

## Comandi Utili

```bash
# Installare dipendenze
npm install

# Eseguire il sito localmente (frontend)
npm run client

# Eseguire il server (backend)
npm start

# Eseguire in modalità sviluppo con auto-reload
npm run dev

# Controllare la versione di Node
node --version

# Controllare la versione di npm
npm --version
```

---

## Supporto

Per problemi o domande:
- 📧 Email: `info@axsenwebsite.com`
- 🐛 Segnala bug su GitHub
- 💬 Contatta il team di supporto

---

## Licenza

MIT License - Vedi il file LICENSE per i dettagli.

---

**Versione**: 2.1.0  
**Ultimo Aggiornamento**: Aprile 2026
