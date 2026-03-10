// ============================================
// AXCMS - Backend Completo per AxsenWebsite AI
// VERSIONE CORRETTA E FUNZIONANTE
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

// ============================================
// CONFIGURAZIONE INIZIALE
// ============================================
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: ["https://axsenwebsite.netlify.app", "http://localhost:3000", "http://127.0.0.1:5500"],
        credentials: true,
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS avanzato
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'https://axsenwebsite.netlify.app',
            'http://localhost:3000',
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'null'
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Headers per sicurezza
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ============================================
// CONNESSIONE DATABASE CON FALLBACK
// ============================================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/axsenwebsite';

let isMongoConnected = false;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
.then(() => {
    console.log('✅ MongoDB Connesso con successo!');
    isMongoConnected = true;
})
.catch(err => {
    console.error('❌ MongoDB NON connesso, uso storage locale:', err.message);
    isMongoConnected = false;
});

// ============================================
// MODELLI DATABASE CON FALLBACK LOCALE
// ============================================

// Storage locale quando MongoDB non è disponibile
let localLeads = [];
let localChats = [];
let localVisitors = [];
let localUsers = [];

// Schema Lead
const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    projectType: { type: String, enum: ['business', 'ecommerce', 'portfolio', 'blog', 'other'], default: 'other' },
    budget: { type: String, enum: ['500-1000', '1000-3000', '3000+', 'non-specificato'], default: 'non-specificato' },
    timeline: { type: String, enum: ['urgent', 'normal', 'flexible', 'non-specificato'], default: 'non-specificato' },
    message: { type: String, required: true },
    features: [String],
    aiScore: { type: Number, default: 50, min: 0, max: 100 },
    status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'lost'], default: 'new' },
    source: { type: String, default: 'website' },
    ip: String,
    userAgent: String,
    notes: [{
        text: String,
        createdBy: String,
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    contactedAt: Date,
    convertedAt: Date
});

// Schema Chat
const chatSchema = new mongoose.Schema({
    userId: String,
    userMessage: String,
    aiResponse: String,
    timestamp: { type: Date, default: Date.now }
});

// Schema Utenti
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff' },
    createdAt: { type: Date, default: Date.now }
});

// Schema Visitatori
const visitorSchema = new mongoose.Schema({
    ip: String,
    page: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
});

// Creazione modelli (solo se MongoDB connesso)
let Lead, Chat, User, Visitor;
if (isMongoConnected) {
    Lead = mongoose.model('Lead', leadSchema);
    Chat = mongoose.model('Chat', chatSchema);
    User = mongoose.model('User', userSchema);
    Visitor = mongoose.model('Visitor', visitorSchema);
}

// ============================================
// SERVIZIO EMAIL MIGLIORATO
// ============================================
let transporter = null;

try {
    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        },
        debug: true
    });

    // Verifica connessione
    transporter.verify(function(error, success) {
        if (error) {
            console.log('⚠️ Email transporter non configurato:', error.message);
        } else {
            console.log('✅ Server email pronto a inviare messaggi');
        }
    });
} catch (error) {
    console.log('⚠️ Email non configurata, funzionerà in modalità log');
}

// ============================================
// GEMINI AI PROXY ENDPOINT
// ============================================
app.post('/api/ai/gemini', async (req, res) => {
    try {
        const { prompt, temperature = 0.7, maxTokens = 300 } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt richiesto' });
        }

        // Usa API key da .env
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        if (AIzaSyCsVi2kId75_2qMrbOsHCEYGBJw6Qfkntw) {
            // Fallback con risposte predefinite
            const fallbackResponses = {
                'lead': generateLeadResponse(req.body),
                'default': "Grazie per averci contattato! Il nostro team ti risponderà al più presto. Nel frattempo, puoi esplorare i nostri AI Tools per iniziare a progettare il tuo sito."
            };
            
            return res.json({ 
                success: true, 
                text: fallbackResponses.lead || fallbackResponses.default,
                source: 'fallback'
            });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ 
                    parts: [{ 
                        text: prompt 
                    }] 
                }],
                generationConfig: {
                    temperature: temperature,
                    maxOutputTokens: maxTokens,
                    topP: 0.8,
                    topK: 10
                }
            },
            {
                headers: { 
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        res.json({ 
            success: true, 
            text: text,
            source: 'gemini'
        });

    } catch (error) {
        console.error('Gemini API error:', error.message);
        
        // Fallback con risposta predefinita
        res.json({ 
            success: true, 
            text: generateLeadResponse(req.body),
            source: 'fallback'
        });
    }
});

// Funzione helper per risposte fallback
function generateLeadResponse(data) {
    const name = data.prompt?.includes('nome') ? 'Cliente' : 'utente';
    return `Ciao! 👋 Grazie per averci contattato. Il nostro team analizzerà la tua richiesta e ti risponderà entro 24 ore. Nel frattempo, puoi provare il nostro AI Project Builder per iniziare a progettare il tuo sito web!`;
}

// ============================================
// TRACKING VISITATORI (Socket.io)
// ============================================
let onlineVisitors = 0;
const visitors = new Set();

io.on('connection', (socket) => {
    const ip = socket.handshake.address;
    visitors.add(ip);
    onlineVisitors = visitors.size;
    
    io.emit('visitorCount', onlineVisitors);
    
    // Salva visita
    const visitorData = {
        ip,
        userAgent: socket.handshake.headers['user-agent'],
        timestamp: new Date()
    };
    
    if (isMongoConnected && Visitor) {
        Visitor.create(visitorData).catch(err => {});
    } else {
        localVisitors.push(visitorData);
    }
    
    socket.on('disconnect', () => {
        visitors.delete(ip);
        onlineVisitors = visitors.size;
        io.emit('visitorCount', onlineVisitors);
    });
});

// ============================================
// API ROUTES - AI FUNCTIONS MIGLIORATE
// ============================================

// 1. AI Chat Assistant con risposte dinamiche
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Messaggio richiesto' });
        }
        
        // Database di risposte avanzate
        const responses = {
            'budget': getBudgetResponse(message),
            'prezzo': getBudgetResponse(message),
            'costo': getBudgetResponse(message),
            'tempo': getTimeResponse(message),
            'tempistiche': getTimeResponse(message),
            'quanto tempo': getTimeResponse(message),
            'idea': getIdeaResponse(message),
            'e-commerce': getEcommerceResponse(message),
            'ecommerce': getEcommerceResponse(message),
            'negozio online': getEcommerceResponse(message),
            'vendere': getEcommerceResponse(message),
            'portfolio': getPortfolioResponse(message),
            'sito vetrina': getBasicResponse(message),
            'blog': getBlogResponse(message),
            'contattare': getContactResponse(message),
            'telefono': getContactResponse(message),
            'email': getContactResponse(message),
            'chat': getContactResponse(message),
            'assistenza': getContactResponse(message),
            'aiuto': getContactResponse(message),
            'ciao': getGreetingResponse(message),
            'salve': getGreetingResponse(message),
            'buongiorno': getGreetingResponse(message)
        };
        
        // Trova la risposta appropriata
        let aiResponse = "Grazie per il tuo messaggio! Posso aiutarti con diverse opzioni:\n\n🤖 **Project Builder** - Crea il tuo sito passo passo\n💰 **Price Calculator** - Calcola il costo\n💡 **Idea Generator** - Trasforma la tua idea\n📝 **AI Copywriter** - Genera testi\n\nCosa preferisci esplorare?";
        
        const lowerMsg = message.toLowerCase();
        for (const [key, value] of Object.entries(responses)) {
            if (lowerMsg.includes(key)) {
                aiResponse = value;
                break;
            }
        }
        
        // Salva chat se MongoDB disponibile
        if (isMongoConnected && Chat && userId) {
            await Chat.create({ userId, userMessage: message, aiResponse });
        } else {
            localChats.push({ userId, userMessage: message, aiResponse, timestamp: new Date() });
        }
        
        res.json({ 
            success: true, 
            response: aiResponse,
            timestamp: new Date()
        });
        
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Errore nel processare il messaggio',
            response: "Mi dispiace, c'è stato un errore. Puoi riprovare o contattarci direttamente via email."
        });
    }
});

// Funzioni helper per risposte specifiche
function getBudgetResponse(message) {
    const budgets = [
        "💰 **Budget consigliato:**\n\n• Sito vetrina: €500 - €1.000\n• Sito business: €1.000 - €3.000\n• E-commerce: €2.500 - €5.000+\n\nVuoi usare il nostro **Price Calculator** per un preventivo preciso?",
        "📊 Per darti un'idea:\n\n• Pagine extra: +€150 cad.\n• E-commerce: +€500\n• Blog: +€200\n• Area membri: +€400\n\nPosso aiutarti con un calcolo personalizzato!"
    ];
    return budgets[Math.floor(Math.random() * budgets.length)];
}

function getTimeResponse(message) {
    return "⏱️ **Tempistiche standard:**\n\n• Sito semplice: 1-2 settimane\n• Sito business: 3-4 settimane\n• E-commerce: 4-6 settimane\n• Progetti complessi: 6-8 settimane\n\nPosso aiutarti a pianificare il tuo progetto!";
}

function getIdeaResponse(message) {
    return "💡 Ottima idea! Posso aiutarti a svilupparla:\n\n1. Usa il nostro **Idea Generator** per strutturare il progetto\n2. Prova il **Business Analyzer** per analizzare il settore\n3. Scopri le funzionalità consigliate con il **Design Advisor**\n\nVuoi iniziare subito?";
}

function getEcommerceResponse(message) {
    return "🛒 **E-commerce - Cosa includere:**\n\n• Catalogo prodotti\n• Carrello e checkout\n• Pagamenti sicuri (Stripe/PayPal)\n• Gestione inventario\n• Recensioni clienti\n• Dashboard ordini\n\nBudget indicativo: €2.500 - €5.000+\n\nVuoi un preventivo personalizzato?";
}

function getPortfolioResponse(message) {
    return "🎨 **Portfolio professionale:**\n\n• Galleria immagini/video\n• Lightbox interattivo\n• Filtri per categoria\n• Sezione About/Contatti\n• Blog integrato\n\nBudget: €800 - €2.000\nTempi: 2-3 settimane\n\nTi interessa?";
}

function getBasicResponse(message) {
    return "🌐 **Sito vetrina base:**\n\n• 5 pagine (Home, Chi Siamo, Servizi, Contatti)\n• Design responsive\n• Form contatti\n• Mappa Google\n• SEO base\n\nBudget: €500 - €1.000\nTempi: 1-2 settimane\n\nPosso aiutarti a configurarlo?";
}

function getBlogResponse(message) {
    return "📝 **Blog professionale:**\n\n• Gestione articoli\n• Categorie e tag\n• Commenti moderati\n• Newsletter integrata\n• SEO ottimizzato\n\nBudget: €600 - €1.500\n\nVuoi aggiungere un blog al tuo sito?";
}

function getContactResponse(message) {
    return "📞 **Contattaci:**\n\n• Email: info@axsenwebsite.com\n• Tel: +39 123 456 7890\n• Chat live: disponibile 24/7\n• Orari: Lun-Ven 9:00-18:00\n\nPreferisci che ti richiamiamo? Lascia il tuo numero!";
}

function getGreetingResponse(message) {
    return "👋 Ciao! Sono l'assistente AI di AxsenWebsite. Come posso aiutarti oggi?\n\nPosso:\n• Calcolare il costo del tuo sito\n• Suggerirti funzionalità\n• Generare testi e idee\n• Rispondere a domande\n\nDimmi cosa ti serve!";
}

// 2. AI Idea Generator migliorato
app.post('/api/ai/generate-idea', async (req, res) => {
    try {
        const { idea } = req.body;
        
        if (!idea) {
            return res.status(400).json({ error: 'Descrizione idea richiesta' });
        }
        
        const analysis = analyzeIdeaAdvanced(idea);
        
        res.json({
            success: true,
            analysis: analysis.text,
            structured: analysis
        });
        
    } catch (error) {
        console.error('Idea generator error:', error);
        res.status(500).json({ error: 'Errore nella generazione idea' });
    }
});

function analyzeIdeaAdvanced(idea) {
    const lower = idea.toLowerCase();
    
    // Analisi avanzata con più variabili
    let result = {
        text: '',
        pages: [],
        features: [],
        budget: { min: 1000, max: 3000 },
        timeline: { value: 4, unit: 'settimane' },
        complexity: 'media',
        technologies: []
    };
    
    // Ristorazione
    if (lower.includes('ristorante') || lower.includes('pizzeria') || lower.includes('cibo')) {
        result = {
            text: '✅ Analisi completata: Sito per Ristorante con prenotazioni online',
            pages: [
                'Homepage accattivante con foto',
                'Menu digitale interattivo',
                'Sistema prenotazioni online',
                'Galleria immagini',
                'Chi Siamo / Chef',
                'Contatti e mappa'
            ],
            features: [
                'Prenotazioni 24/7 con conferma automatica',
                'Menu PDF scaricabile',
                'Sistema recensioni Google integrato',
                'Newsletter per eventi',
                'Integrazione con TheFork/TripAdvisor'
            ],
            budget: { min: 1800, max: 3500 },
            timeline: { value: 5, unit: 'settimane' },
            complexity: 'medio-alta',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
        };
    }
    // E-commerce
    else if (lower.includes('e-commerce') || lower.includes('vendere') || lower.includes('negozio online')) {
        result = {
            text: '✅ Analisi completata: E-commerce completo con gestione ordini',
            pages: [
                'Homepage vetrina',
                'Catalogo prodotti con filtri',
                'Pagina prodotto dettagliata',
                'Carrello e checkout',
                'Area utente/ordini',
                'Dashboard amministrativa'
            ],
            features: [
                'Carrello della spesa avanzato',
                'Pagamenti Stripe/PayPal/Contrassegno',
                'Gestione inventario automatica',
                'Spedizioni e tracking',
                'Coupon e sconti',
                'Recensioni prodotti'
            ],
            budget: { min: 3000, max: 6000 },
            timeline: { value: 8, unit: 'settimane' },
            complexity: 'alta',
            technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Redis']
        };
    }
    // Portfolio/Creativo
    else if (lower.includes('portfolio') || lower.includes('artista') || lower.includes('fotografo')) {
        result = {
            text: '✅ Analisi completata: Portfolio professionale con galleria',
            pages: [
                'Homepage creativa',
                'Galleria progetti con filtri',
                'Chi Sono / Bio',
                'Servizi offerti',
                'Contatti e social',
                'Blog (opzionale)'
            ],
            features: [
                'Galleria immagini/video con Lightbox',
                'Filtri per categoria',
                'Download portfolio PDF',
                'Richiesta preventivo',
                'Integrazione Instagram'
            ],
            budget: { min: 800, max: 2000 },
            timeline: { value: 3, unit: 'settimane' },
            complexity: 'media',
            technologies: ['Vue.js', 'GSAP', 'Node.js', 'MongoDB']
        };
    }
    // Business/Professionale
    else {
        result = {
            text: '✅ Analisi completata: Sito Business professionale con blog',
            pages: [
                'Homepage aziendale',
                'Chi Siamo / Storia',
                'Servizi dettagliati',
                'Portfolio progetti',
                'Blog aziendale',
                'Contatti avanzati'
            ],
            features: [
                'Blog con CMS integrato',
                'Newsletter automation',
                'Form contatti avanzato',
                'Mappa interattiva',
                'Chat live 24/7',
                'Area download materiali'
            ],
            budget: { min: 1500, max: 3000 },
            timeline: { value: 4, unit: 'settimane' },
            complexity: 'media',
            technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind']
        };
    }
    
    return result;
}

// 3. AI Copywriter migliorato
app.post('/api/ai/copywriter', async (req, res) => {
    try {
        const { type, keywords, tone, length = 'medio' } = req.body;
        
        const copies = {
            'headline': {
                'breve': `Siti Web Professionali che Convertono`,
                'medio': `Trasformiamo la tua visione in realtà digitale con siti web che convertono`,
                'lungo': `Il tuo business merita un sito web professionale che non sia solo bello, ma che converta i visitatori in clienti`
            },
            'about': {
                'breve': `Esperti in web design dal 2020`,
                'medio': `Da oltre 5 anni aiutiamo aziende come la tua a emergere nel digitale con soluzioni su misura`,
                'lungo': `Siamo un team di sviluppatori e designer appassionati che utilizza l'intelligenza artificiale per creare siti web ad alte prestazioni. La nostra missione? Rendere il digitale accessibile a tutti.`
            },
            'cta': {
                'breve': `Inizia Ora`,
                'medio': `Richiedi una Consulenza Gratuita`,
                'lungo': `Pronto a portare il tuo business online? Contattaci oggi per una consulenza gratuita e scopri come possiamo aiutarti a crescere.`
            }
        };
        
        let copy = copies[type]?.[length] || copies.headline.medio;
        
        // Personalizza con keywords
        if (keywords) {
            copy = copy.replace(/siti web/i, keywords);
        }
        
        res.json({
            success: true,
            copy: copy,
            wordCount: copy.split(' ').length,
            tone: tone,
            length: length
        });
        
    } catch (error) {
        console.error('Copywriter error:', error);
        res.status(500).json({ error: 'Errore nella generazione testo' });
    }
});

// 4. Price Calculator avanzato
app.post('/api/ai/calculate-price', (req, res) => {
    try {
        const { pages = 5, features = [], complexity = 1, design = 'standard', maintenance = false } = req.body;
        
        // Calcolo base
        let basePrice = 500;
        basePrice += pages * 120; // €120 a pagina
        
        // Funzionalità aggiuntive
        const featurePrices = {
            'ecommerce': 600,
            'blog': 250,
            'chat': 200,
            'members': 450,
            'booking': 300,
            'multilanguage': 350,
            'seo': 400,
            'analytics': 250
        };
        
        let featuresPrice = 0;
        features.forEach(feature => {
            featuresPrice += featurePrices[feature] || 0;
        });
        
        // Moltiplicatori
        const complexityMultiplier = complexity || 1;
        const designMultiplier = design === 'premium' ? 1.5 : design === 'custom' ? 1.2 : 1;
        
        // Calcolo finale
        let total = (basePrice + featuresPrice) * complexityMultiplier * designMultiplier;
        
        // Manutenzione annuale
        const maintenancePrice = maintenance ? Math.round(total * 0.2) : 0;
        
        // Breakdown dettagliato
        const breakdown = {
            base: basePrice,
            pages: pages * 120,
            features: featuresPrice,
            subtotal: basePrice + featuresPrice,
            complexity: Math.round((basePrice + featuresPrice) * (complexityMultiplier - 1)),
            design: Math.round((basePrice + featuresPrice) * (designMultiplier - 1)),
            total: Math.round(total),
            maintenance: maintenancePrice,
            finalTotal: Math.round(total + maintenancePrice)
        };
        
        res.json({
            success: true,
            price: breakdown.finalTotal,
            breakdown: breakdown,
            features: features.map(f => ({ name: f, price: featurePrices[f] || 0 }))
        });
        
    } catch (error) {
        console.error('Price calculator error:', error);
        res.status(500).json({ error: 'Errore nel calcolo prezzo' });
    }
});

// ============================================
// API CRM - LEAD MANAGEMENT
// ============================================

// Salva lead dal form contatti - VERSIONE CORRETTA
app.post('/api/crm/lead', [
    body('name').notEmpty().withMessage('Nome richiesto'),
    body('email').isEmail().withMessage('Email valida richiesta'),
    body('message').notEmpty().withMessage('Messaggio richiesto')
], async (req, res) => {
    try {
        // Validazione
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }
        
        const leadData = req.body;
        
        // Calcola AI score avanzato
        let score = 50;
        
        // Punteggio per email (email aziendale = più punti)
        if (leadData.email) {
            score += 5;
            if (!leadData.email.includes('gmail') && !leadData.email.includes('yahoo') && !leadData.email.includes('hotmail')) {
                score += 10; // Email aziendale
            }
        }
        
        // Punteggio per nome completo
        if (leadData.name && leadData.name.split(' ').length > 1) {
            score += 10; // Nome e cognome
        }
        
        // Punteggio per azienda
        if (leadData.company && leadData.company.length > 3) {
            score += 10;
        }
        
        // Punteggio per budget
        if (leadData.budget === '3000+') score += 20;
        else if (leadData.budget === '1000-3000') score += 15;
        else if (leadData.budget === '500-1000') score += 10;
        
        // Punteggio per tempistiche urgenti
        if (leadData.timeline === 'urgent') score += 20;
        else if (leadData.timeline === 'normal') score += 10;
        
        // Punteggio per messaggio dettagliato
        const messageLength = leadData.message?.length || 0;
        if (messageLength > 200) score += 20;
        else if (messageLength > 100) score += 15;
        else if (messageLength > 50) score += 10;
        
        // Punteggio per parole chiave nel messaggio
        const keywords = ['e-commerce', 'ecommerce', 'negozio', 'vendere', 'business', 'azienda', 'professionale'];
        const message = leadData.message?.toLowerCase() || '';
        keywords.forEach(keyword => {
            if (message.includes(keyword)) score += 5;
        });
        
        score = Math.min(100, Math.max(0, score));
        
        // Prepara lead
        const lead = {
            ...leadData,
            aiScore: score,
            ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
            userAgent: req.get('user-agent') || 'unknown',
            status: score >= 70 ? 'qualified' : 'new',
            createdAt: new Date()
        };
        
        // Salva in MongoDB o locale
        let savedLead;
        if (isMongoConnected && Lead) {
            savedLead = await Lead.create(lead);
        } else {
            lead._id = localLeads.length + 1;
            localLeads.push(lead);
            savedLead = lead;
        }
        
        console.log('✅ Lead salvato:', lead.email, 'Score:', score);
        
        // Invia email di conferma (non bloccante)
        if (transporter && leadData.email) {
            try {
                await transporter.sendMail({
                    from: '"AxsenWebsite AI" <noreply@axsenwebsite.com>',
                    to: leadData.email,
                    subject: 'Grazie per averci contattato!',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #3b82f6;">Ciao ${leadData.name}!</h2>
                            <p>Grazie per averci contattato. Il nostro team analizzerà la tua richiesta e ti risponderà entro <strong>24 ore</strong>.</p>
                            
                            <div style="background: linear-gradient(135deg, #3b82f6, #00f0ff); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                <h3 style="margin-top: 0;">📊 Analisi AI della tua richiesta</h3>
                                <p><strong>AI Score:</strong> ${score}%</p>
                                <p><strong>Progetto:</strong> ${leadData.projectType || 'Non specificato'}</p>
                                <p><strong>Budget:</strong> ${leadData.budget || 'Non specificato'}</p>
                                <p><strong>Tempistiche:</strong> ${leadData.timeline || 'Non specificato'}</p>
                            </div>
                            
                            <h3>🚀 Prova subito i nostri strumenti AI:</h3>
                            <ul>
                                <li><a href="${process.env.FRONTEND_URL || 'https://axsenwebsite.netlify.app'}/#ai-tools">AI Project Builder</a></li>
                                <li><a href="${process.env.FRONTEND_URL || 'https://axsenwebsite.netlify.app'}/#price-calculator">AI Price Calculator</a></li>
                                <li><a href="${process.env.FRONTEND_URL || 'https://axsenwebsite.netlify.app'}/#idea-generator">AI Idea Generator</a></li>
                            </ul>
                            
                            <p>A presto!<br><strong>Team AxsenWebsite</strong></p>
                        </div>
                    `
                });
                console.log('✅ Email conferma inviata a:', leadData.email);
            } catch (emailError) {
                console.log('⚠️ Errore invio email (non bloccante):', emailError.message);
            }
        }
        
        // Invia notifica admin
        if (transporter && process.env.ADMIN_EMAIL) {
            try {
                await transporter.sendMail({
                    from: '"AxsenWebsite AI" <noreply@axsenwebsite.com>',
                    to: process.env.ADMIN_EMAIL,
                    subject: '🔔 Nuovo Lead Ricevuto!',
                    html: `
                        <h2>Nuovo Lead dal sito</h2>
                        <p><strong>Nome:</strong> ${leadData.name}</p>
                        <p><strong>Email:</strong> ${leadData.email}</p>
                        <p><strong>Telefono:</strong> ${leadData.phone || 'N/D'}</p>
                        <p><strong>Azienda:</strong> ${leadData.company || 'N/D'}</p>
                        <p><strong>Budget:</strong> ${leadData.budget || 'N/D'}</p>
                        <p><strong>Tempistiche:</strong> ${leadData.timeline || 'N/D'}</p>
                        <p><strong>AI Score:</strong> ${score}% (${score >= 70 ? '🔥 Qualificato' : '👀 Da valutare'})</p>
                        <p><strong>Messaggio:</strong> ${leadData.message}</p>
                        <p><a href="${process.env.FRONTEND_URL || 'https://axsenwebsite.netlify.app'}/admin">Vai alla dashboard</a></p>
                    `
                });
            } catch (emailError) {
                console.log('⚠️ Errore notifica admin:', emailError.message);
            }
        }
        
        // Risposta
        res.json({
            success: true,
            lead: {
                id: savedLead._id || savedLead.id,
                aiScore: score,
                status: lead.status,
                message: 'Lead salvato con successo! Riceverai una conferma email.'
            }
        });
        
    } catch (error) {
        console.error('❌ Lead creation error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Errore nel salvataggio',
            message: 'Si è verificato un errore. Riprova o contattaci direttamente.'
        });
    }
});

// ============================================
// API PUBBLICHE
// ============================================

// Track page view
app.post('/api/track', async (req, res) => {
    try {
        const { page } = req.body;
        const data = {
            ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
            page: page || '/',
            userAgent: req.get('user-agent') || 'unknown',
            timestamp: new Date()
        };
        
        if (isMongoConnected && Visitor) {
            await Visitor.create(data);
        } else {
            localVisitors.push(data);
        }
        
        res.json({ success: true });
    } catch (error) {
        // Non bloccare mai
        res.json({ success: true });
    }
});

// Get online visitors
app.get('/api/visitors', (req, res) => {
    res.json({ 
        success: true, 
        count: onlineVisitors,
        timestamp: new Date()
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime(),
        visitors: onlineVisitors,
        database: isMongoConnected ? 'connected' : 'local-storage',
        email: transporter ? 'configured' : 'disabled',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
    try {
        if (!transporter) {
            return res.status(400).json({ error: 'Email non configurata' });
        }
        
        await transporter.sendMail({
            from: '"Test" <noreply@axsenwebsite.com>',
            to: req.body.email || process.env.ADMIN_EMAIL || 'test@example.com',
            subject: 'Test Email AxsenWebsite',
            text: 'Funziona! Il sistema email è configurato correttamente.'
        });
        
        res.json({ success: true, message: 'Email inviata!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// AUTH ENDPOINTS
// ============================================

// Register (solo per setup iniziale)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Tutti i campi sono richiesti' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userData = {
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date()
        };
        
        let user;
        if (isMongoConnected && User) {
            user = await User.create(userData);
        } else {
            user = { ...userData, _id: localUsers.length + 1 };
            localUsers.push(user);
        }
        
        // Genera token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback-secret-key-change-this',
            { expiresIn: '30d' }
        );
        
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Errore nella registrazione' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Cerca utente
        let user = null;
        if (isMongoConnected && User) {
            user = await User.findOne({ email });
        } else {
            user = localUsers.find(u => u.email === email);
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }
        
        // Verifica password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }
        
        // Genera token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback-secret-key-change-this',
            { expiresIn: '30d' }
        );
        
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Errore nel login' });
    }
});

// ============================================
// GESTIONE ERRORI GLOBALE
// ============================================
app.use((err, req, res, next) => {
    console.error('❌ Global error:', err);
    res.status(500).json({ 
        error: 'Errore interno del server',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'API non trovata',
        path: req.url
    });
});

// ============================================
// SEED DATABASE
// ============================================
async function seedDatabase() {
    try {
        // Crea admin di default se non esiste
        if (isMongoConnected && User) {
            const adminExists = await User.findOne({ email: 'admin@axsenwebsite.com' });
            if (!adminExists) {
                const hashedPassword = await bcrypt.hash('Admin123!', 10);
                await User.create({
                    name: 'Admin',
                    email: 'admin@axsenwebsite.com',
                    password: hashedPassword,
                    role: 'admin'
                });
                console.log('✅ Admin creato: admin@axsenwebsite.com / Admin123!');
            }
        } else {
            // Fallback locale
            const adminExists = localUsers.some(u => u.email === 'admin@axsenwebsite.com');
            if (!adminExists) {
                const hashedPassword = await bcrypt.hash('Admin123!', 10);
                localUsers.push({
                    name: 'Admin',
                    email: 'admin@axsenwebsite.com',
                    password: hashedPassword,
                    role: 'admin',
                    createdAt: new Date()
                });
                console.log('✅ Admin locale creato: admin@axsenwebsite.com / Admin123!');
            }
        }
    } catch (error) {
        console.log('⚠️ Seed error:', error.message);
    }
}

// ============================================
// AVVIO SERVER
// ============================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 AXCMS - Backend Avviato con Successo!');
    console.log('='.repeat(60));
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'https://axsenwebsite.netlify.app'}`);
    console.log(`📊 Database: ${isMongoConnected ? '✅ MongoDB' : '⚠️ Storage Locale'}`);
    console.log(`📧 Email: ${transporter ? '✅ Configurata' : '⚠️ Disabilitata'}`);
    console.log(`👥 Visitatori online: ${onlineVisitors}`);
    console.log('='.repeat(60));
    console.log('\n📌 API Disponibili:');
    console.log('   POST   /api/ai/chat                 - Chat AI');
    console.log('   POST   /api/ai/generate-idea        - Genera idea');
    console.log('   POST   /api/ai/copywriter           - Genera testi');
    console.log('   POST   /api/ai/calculate-price      - Calcola prezzo');
    console.log('   POST   /api/ai/gemini               - Gemini AI');
    console.log('   POST   /api/crm/lead                - Salva lead');
    console.log('   POST   /api/track                    - Traccia visite');
    console.log('   GET    /api/visitors                 - Visitatori online');
    console.log('   GET    /api/health                    - Health check');
    console.log('='.repeat(60) + '\n');
    
    await seedDatabase();
});

// Gestione graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Ricevuto SIGTERM, chiusura server...');
    server.close(() => {
        console.log('✅ Server chiuso');
        process.exit(0);
    });
});

module.exports = { app, server };