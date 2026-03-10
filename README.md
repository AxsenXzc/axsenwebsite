# 🚀 AxsenWebsite - AI-Powered Web Design Studio

> Studio di web design professionali con 50+ strumenti AI integrati

## ✨ Caratteristiche

- ✅ **20 AI Tools Funzionanti** - Tutti completamente testati e ottimizzati
- 🎨 **Design Moderno** - Interfaccia professionale con Tailwind CSS
- 📱 **100% Responsive** - Perfetto su mobile, tablet e desktop
- 🔒 **GDPR Compliant** - Privacy policy e termini di servizio integrati
- 📧 **Formspree Integration** - Email automatiche senza backend
- 🍪 **Cookie Banner** - Conforme alle normative europee
- 🎯 **Lead Scoring AI** - Qualificazione automatica dei lead
- ⚡ **Performance** - Ottimizzato per velocità e SEO

## 🛠️ Tecnologie

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Email**: Formspree (gestione automatica)
- **Hosting**: Netlify (gratuito)
- **Analytics**: Google Analytics (opzionale)

## 📋 Setup Rapido

### 1. Clona il repository
```bash
git clone https://github.com/axsenwebsite/axsenwebsite.git
cd axsenwebsite
```

### 2. Configura Formspree

1. Vai su https://formspree.io
2. Crea un account gratuito
3. Crea un nuovo form "AxsenWebsite Leads"
4. Copia il Form ID (es: `f/xyzabc123`)
5. Aggiorna il file `index.html` riga 515:
```javascript
const FORMSPREE_ID = 'f/xyzabc123'; // ← CAMBIA QUI
```

### 3. Deploy su Netlify

1. Vai su https://app.netlify.com
2. Clicca "New site from Git"
3. Seleziona il tuo repository
4. Settings:
   - **Build command**: (lascia vuoto)
   - **Publish directory**: `.`
5. Deploy!

### 4. Test Locale

```bash
npm start
# Oppure
python -m http.server 8000
```

Visita: http://localhost:8000

## 📁 Struttura dei File

```
.
├── index.html           # Homepage con tutti gli AI tools
├── thank-you.html       # Pagina di ringraziamento
├── .env                 # Configurazione (non commitare!)
├── .gitignore           # Git ignore file
├── package.json         # Metadata e script
└── README.md            # Questo file
```

## 🤖 AI Tools Inclusi

### 📋 Pianificazione (4)
- 🏗️ Project Builder
- 💰 Smart Calculator
- 💡 Idea Generator
- 📋 Brief Builder

### 🎨 Design (4)
- 🎨 Design Advisor
- 🖼️ Layout Generator
- 🌈 Color Palette
- ✏️ Typography Helper

### ✍️ Contenuti (4)
- ✍️ AI Copywriter
- 📝 Content Planner
- 🎯 Meta Writer
- 💬 FAQ Generator

### 📊 Analisi (4)
- 📊 Business Analyzer
- 🔍 Competitor Scanner
- ⭐ Lead Scorer
- 📈 Market Research

### ⚡ Ottimizzazione (4)
- 🚀 SEO Optimizer
- ⚡ Performance Boost
- 📱 Mobile Optimizer
- ♿ Accessibility Checker

## 🔐 Privacy & GDPR

- ✅ Privacy Policy completa inclusa
- ✅ Termini di Servizio inclusi
- ✅ Cookie banner conforme GDPR
- ✅ Dati NON venduti a terzi
- ✅ Conformità e-Privacy

## 📧 Email Configuration

Formspree gestisce automaticamente:
- ✅ Invio email al proprietario
- ✅ Autoresponse al cliente (PRO)
- ✅ Spam filtering
- ✅ Database storico

**Per passare a PRO ($15/mese):**
- Autoresponse email personalizzate
- Webhook integrations
- Unlimited submissions
- File uploads

## 📊 Analytics

Per abilitare Google Analytics:

1. Aggiungi il tuo GA ID al `.env`
2. Importa Google Analytics nello script
3. Modifica il file `index.html` per includerlo

## 🚀 Deployment Checklist

```
✅ Formspree ID configurato in index.html
✅ Privacy Policy rivista
✅ Termini di Servizio rivisti
✅ Email admin configurata
✅ Testing completo effettuato
✅ Mobile testing fatto
✅ Google Analytics (opzionale) configurato
✅ Deploy su Netlify
✅ Dominio custom configurato (opzionale)
```

## 💡 Customizzazione

### Cambia Colori

Modifica le variabili CSS in `index.html` (righe 78-85):

```css
--primary: #3b82f6;
--accent: #00f0ff;
--dark: #0f172a;
```

### Cambia Texti

Modifica i testi direttamente nell'HTML

### Aggiungi Più AI Tools

Aggiungi elementi all'array `aiTools` in `index.html` (riga 542-571)

## 🐛 Troubleshooting

**Le email non arrivano?**
- Verifica il Form ID Formspree
- Controlla la cartella spam
- Testa da https://formspree.io/dashboard

**Il form non invia?**
- Controlla la console browser (F12)
- Verifica la privacy checkbox
- Testa il Form ID

**Mobile non responsive?**
- Pulisci il cache del browser
- Verifica viewport meta tag
- Testa con device reale

## 📞 Support

Per domande e problemi:
- 📧 Email: support@axsenwebsite.com
- 🔗 GitHub: https://github.com/axsenwebsite
- 💬 Chat: Website live chat

## 📄 Licenza

MIT License - Vedi LICENSE.md

## 🎯 Roadmap

- [ ] Backend Node.js/Express
- [ ] MongoDB CRM
- [ ] Advanced Analytics
- [ ] Multi-language Support
- [ ] E-learning Platform
- [ ] White-label Version

---

Fatto con ❤️ e AI da **AxsenWebsite Team**

Last Updated: 2024-01-15
```