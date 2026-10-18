import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini client initialization notice:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Executive Insight generation endpoint
app.post('/api/ai/executive-insight', async (req, res) => {
  const { period = 'FY 2025 (YTD)', currency = 'GBP', region = 'All Regions', scenario = 'Base Case' } = req.body || {};

  // Deterministic fallback synthesis grounded in BAT executive dataset
  const fallbackInsight = {
    summary: "Growth remains resilient, supported by pricing and continued expansion in New Categories. Regulatory changes, illicit trade and currency volatility remain key watchpoints. Prioritize market-specific pricing scenarios and disciplined investment in transformation. Early indicators suggest further upside in New Categories in H2, with operating margin expected to remain stable within 42–43% range, barring significant regulatory headwinds.",
    pillars: [
      {
        title: "Revenue & Pricing Power",
        detail: `Under ${period} on ${currency} basis (${region}), consolidated revenue of £25.9B (+3.1% YoY) reflects strong price-mix elasticity offsetting legacy volume moderation.`
      },
      {
        title: "New Categories Transformation",
        detail: "Non-combustible portfolio revenue reached £3.4B (+12.6% YoY), driven by Vuse market leadership in closed vapour and accelerated glo Hyper adoption in Europe and APME."
      },
      {
        title: "Margin Discipline & Cash Flow",
        detail: "Operating margin expanded +0.6 pp to 42.5%, delivering £8.2B operating cash flow (+4.8% YoY) despite elevated transitional capex and supply chain indexation."
      },
      {
        title: "Key Vulnerabilities",
        detail: "Critical sensitivities include US menthol regulatory determination, potential excise indexation in APME, and working capital expansion in European distributor channels."
      }
    ],
    timestamp: new Date().toISOString(),
    isLiveAi: false
  };

  if (!ai) {
    return res.json(fallbackInsight);
  }

  try {
    const prompt = `You are the Principal AI Advisor to the British American Tobacco (BAT) Executive Committee and CFO.
Provide an authoritative, grounded 4-part executive briefing for the CFO dashboard.
Context:
- Reporting Period: ${period}
- Currency: ${currency}
- Regional Scope: ${region}
- Active Scenario: ${scenario}
- Financials: Revenue £25.9B (+3.1% YoY), Adj. Operating Profit £11.0B (+2.4% YoY), Operating Margin 42.5% (+0.6 pp), Operating Cash Flow £8.2B (+4.8%), New Categories Revenue £3.4B (+12.6%), Market Share 27.8% (-0.3 pp).

Provide a concise executive synthesis (approx 65-80 words matching the tone: "Growth remains resilient, supported by pricing...") plus 3 high-impact bulleted executive priorities. Return raw JSON matching:
{
  "summary": "...",
  "pillars": [
    { "title": "...", "detail": "..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({
        ...parsed,
        timestamp: new Date().toISOString(),
        isLiveAi: true
      });
    }
    return res.json(fallbackInsight);
  } catch (error) {
    console.error('Error in AI executive insight endpoint:', error);
    return res.json(fallbackInsight);
  }
});

// Global AI Question endpoint ("Ask BAT Intelligence")
app.post('/api/ai/query', async (req, res) => {
  const { question, context } = req.body || {};

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  // Grounded knowledge answers for common CFO queries
  const qLower = question.toLowerCase();

  let answerText = "";
  let sources = ["BAT FY2025 Preliminary Model", "Management Accounts H1", "Executive Risk Register Q3"];
  let recommendations = ["Review regional price-mix elasticity", "Stress test working capital under +50bps rate scenario"];

  if (qLower.includes('revenue') || qLower.includes('variance') || qLower.includes('explain')) {
    answerText = `Revenue variance of +3.1% YoY (£25.9B vs £25.1B PY) is primarily driven by: (1) Pricing realization across Combustibles (+£820M), (2) New Categories volume growth (+£380M or +12.6%), partially offset by (3) combustible volume attrition (-£310M) and (4) FX headwinds in emerging market currencies (-£90M). Operating profit conversion remains disciplined at 42.5% margin.`;
    recommendations = ["Preserve pricing corridors in Western Europe", "Accelerate Vuse Pro commercialization in APME"];
  } else if (qLower.includes('region') || qLower.includes('profit') || qLower.includes('americas') || qLower.includes('europe')) {
    answerText = `Americas continues to be the largest profit contributor, generating £8.8B in revenue (34% share) with 46.2% operating margin. Europe follows at £7.5B (29% share) with rapid New Categories adoption. Asia Pacific & Middle East delivered £6.5B (25% share) showing resilient volume, while Africa contributed £3.1B (12% share).`;
    recommendations = ["Target distributor inventory normalisation in Europe", "Monitor APME illicit trade spillover"];
  } else if (qLower.includes('margin') || qLower.includes('cost') || qLower.includes('inflation')) {
    answerText = `Operating margin currently sits at 42.5% (+0.6 pp YoY). Key levers: Combustible pricing added +1.4 pp; Supply chain productivity delivered +0.5 pp; offset by New Categories scale investments (-0.8 pp) and packaging/leaf raw material indexation (-0.5 pp). A +5% unmitigated cost shock would compress margin by ~85 bps.`;
    recommendations = ["Trigger Phase 2 Quantum savings initiatives", "Lock forward leaf contracts for FY26"];
  } else if (qLower.includes('cash') || qLower.includes('working capital')) {
    answerText = `Operating cash flow of £8.2B (+4.8% YoY) demonstrates 74.5% conversion of adjusted operating profit. Cash conversion cycle is currently 68 days (DIO 88 days, DSO 34 days, DPO 54 days). Optimizing regional receivables in Europe and rationalizing safety stock in APME could unlock an estimated £210M–£280M in operating liquidity.`;
    recommendations = ["Enforce standard 45-day distributor payment terms", "Implement AI demand sensing to shave 4 days DIO"];
  } else {
    answerText = `Based on the FY2025 executive baseline: Group revenue stands at £25.9B (+3.1% YoY), Adjusted Profit at £11.0B (+2.4%), and Operating Cash Flow at £8.2B (+4.8%). New Categories revenue reached £3.4B (+12.6% YoY) representing 13.1% of consolidated turnover. Capital allocation remains balanced across smoke-free reinvestment, progressive dividend coverage, and deleveraging toward the 2.0x–2.5x net debt/EBITDA target.`;
  }

  if (ai) {
    try {
      const systemInstruction = `You are BAT Intelligence, an executive decision assistant for British American Tobacco's CFO and Executive Committee.
Respond with extreme precision, executive tone, concrete financial metrics, and actionable recommendations.
Distinguish historical facts from forecasts. When discussing risks or sensitivities, cite specific levers (pricing, volume, excise, FX, leaf costs).`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Dashboard Context: ${JSON.stringify(context || {})}
Question: ${question}`,
        config: {
          systemInstruction,
        },
      });

      if (aiResponse.text) {
        answerText = aiResponse.text;
      }
    } catch (err) {
      console.warn('Using deterministic executive intelligence fallback:', err);
    }
  }

  res.json({
    question,
    answer: answerText,
    sources,
    recommendations,
    generatedAt: new Date().toISOString()
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BAT Executive Intelligence Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
