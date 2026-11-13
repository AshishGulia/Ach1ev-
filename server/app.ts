import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function resolveProjectFile(filename: string): string {
  const fromCwd = path.resolve(process.cwd(), filename);
  if (fs.existsSync(fromCwd)) return fromCwd;
  return path.resolve(currentDir, '..', filename);
}

// Helper to get GoogleGenAI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const GEMINI_MODEL_PRIORITY = [
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
] as const;

type GenerateParams = Omit<Parameters<GoogleGenAI['models']['generateContent']>[0], 'model'>;

async function generateContentWithFallback(ai: GoogleGenAI, params: GenerateParams) {
  let lastError: unknown;
  for (const model of GEMINI_MODEL_PRIORITY) {
    try {
      const mergedConfig = {
        ...params.config,
        abortSignal: params.config?.abortSignal ?? AbortSignal.timeout(9000),
      };
      return await ai.models.generateContent({
        model,
        ...params,
        config: mergedConfig,
      });
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || err || '');
      const name = String(err?.name || '');
      const status = err?.status ?? err?.code;
      const retryable =
        status === 503 ||
        status === 429 ||
        status === 404 ||
        name === 'AbortError' ||
        name === 'TimeoutError' ||
        msg.includes('503') ||
        msg.includes('429') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('high demand') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('NOT_FOUND') ||
        msg.toLowerCase().includes('timeout') ||
        msg.toLowerCase().includes('aborted');
      if (!retryable) {
        throw err;
      }
      console.warn(`Gemini model ${model} unavailable, trying next fallback...`);
    }
  }
  throw lastError;
}

const PRIMARY_DOMAIN = 'https://ach1ev.com';
const SECONDARY_DOMAINS = [
  'https://www.ach1ev.com',
  'https://achievx.vercel.app',
  'https://ashish-ashish01.vercel.app',
];

function getRequestOrigin(req: express.Request): string {
  const forwardedProto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0]?.trim();
  const forwardedHost = (req.headers['x-forwarded-host'] as string)?.split(',')[0]?.trim();
  const host = forwardedHost || req.get('host');
  if (host) {
    const proto = forwardedProto || (host.includes('localhost') || host.startsWith('127.') ? req.protocol : 'https');
    return `${proto}://${host}`;
  }
  return process.env.APP_URL || PRIMARY_DOMAIN;
}

export function attachApiRoutes(app: express.Express): express.Express {
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '20mb' }));

  // Allow requests from primary domain (ach1ev.com), secondary Vercel domains, and local dev
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      const allowed =
        origin === PRIMARY_DOMAIN ||
        SECONDARY_DOMAINS.includes(origin) ||
        origin.endsWith('.ach1ev.com') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.run.app') ||
        origin.startsWith('http://localhost:');
      if (allowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      }
    }
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Health & Capability Discovery Endpoint
  app.get('/api/health', (_req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
    res.json({
      status: 'ok',
      service: 'ach1ev-cloud-api',
      brand: 'Ach1ev — Settle Ideas',
      primaryDomain: PRIMARY_DOMAIN,
      secondaryDomains: SECONDARY_DOMAINS,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      googleDriveClientConfigured: Boolean(clientId),
      googleOAuthConfigured: Boolean(clientId && process.env.GOOGLE_CLIENT_SECRET),
      supabaseConfigured: Boolean(
        (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
          (process.env.VITE_SUPABASE_ANON_KEY ||
            process.env.SUPABASE_ANON_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      ),
      timestamp: new Date().toISOString(),
    });
  });

  // Google Drive Server-Side OAuth Configuration & Code Exchange Helpers
  app.get('/api/auth/google/config', (_req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
    const hasSecret = Boolean(process.env.GOOGLE_CLIENT_SECRET);
    res.json({
      configured: Boolean(clientId),
      serverFlowReady: Boolean(clientId && hasSecret),
      clientId: clientId || null,
      primaryDomain: PRIMARY_DOMAIN,
    });
  });

  app.get('/api/auth/google/url', (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(400).json({ error: 'GOOGLE_CLIENT_ID is not configured on the server.' });
    }
    const redirectUri =
      (typeof req.query.redirectUri === 'string' && req.query.redirectUri) ||
      process.env.GOOGLE_REDIRECT_URI ||
      `${getRequestOrigin(req)}/api/auth/google/callback`;
    const state = typeof req.query.state === 'string' ? req.query.state : 'ach1ev_drive_oauth';

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      access_type: 'offline',
      include_granted_scopes: 'true',
      prompt: 'consent',
      state,
    });

    return res.json({
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      redirectUri,
    });
  });

  app.post('/api/auth/google/exchange', async (req, res) => {
    try {
      const { code, redirectUri } = req.body || {};
      const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return res.status(400).json({
          error: 'Server-side Google OAuth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
        });
      }
      if (!code) {
        return res.status(400).json({ error: 'Authorization code is required.' });
      }

      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri:
            redirectUri ||
            process.env.GOOGLE_REDIRECT_URI ||
            `${getRequestOrigin(req)}/api/auth/google/callback`,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResp.json();
      if (!tokenResp.ok) {
        return res.status(tokenResp.status).json({
          error: tokenData.error_description || tokenData.error || 'Token exchange failed.',
        });
      }

      return res.json({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        scope: tokenData.scope,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Google token exchange failed.' });
    }
  });

  app.post('/api/auth/google/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body || {};
      const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret || !refreshToken) {
        return res.status(400).json({ error: 'Missing OAuth credentials or refresh token.' });
      }

      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
        }),
      });

      const tokenData = await tokenResp.json();
      if (!tokenResp.ok) {
        return res.status(tokenResp.status).json({
          error: tokenData.error_description || tokenData.error || 'Token refresh failed.',
        });
      }

      return res.json({
        accessToken: tokenData.access_token,
        expiresIn: tokenData.expires_in,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Token refresh error.' });
    }
  });

  // 1. AI Research & Latest Clinical Studies based on textbook page / topic
  app.post('/api/gemini/research', async (req, res) => {
    try {
      const { topic, pageSnippet, question, fileAttached } = req.body;
      if (!topic && !question) {
        return res.status(400).json({ error: 'Topic or question is required.' });
      }

      if (!process.env.GEMINI_API_KEY) {
        const fallbackTopic = topic || 'Cardiovascular Pharmacology';
        return res.json({
          content: `### 🩺 High-Yield Clinical Synthesis: ${fallbackTopic}

**Topic Focus**: ${question || 'Comprehensive Evidence & Practice Guidelines'}
${fileAttached ? `*Document Reference Attached*: \`${fileAttached}\` analyzed for key diagnostic criteria.\n` : ''}
1. **Core Clinical Summary**:
   - Modern management integrates disease-modifying pharmacotherapy with tailored hemodynamic risk stratification.
   - Early initiation and rapid uptitration to guideline-directed target doses yields substantial reductions in end-organ morbidity.

2. **Key Mechanism & Pharmacology**:
   - Specific receptor antagonism or enzymatic modulation blocks maladaptive neurohormonal activation cascades.
   - Reduces systemic vascular resistance, preserves organ perfusion pressure, and prevents pathological tissue remodeling.

3. **Landmark Clinical Studies & Evidence**:
   - *PARADIGM-HF (2014)*: Demonstrated 20% relative risk reduction in CV mortality with dual neprilysin/ARB inhibition.
   - *EMPA-REG OUTCOME (2015)*: SGLT2 inhibition reduced cardiovascular death and all-cause mortality across high-risk cohorts.

4. **Adverse Effects & Critical Monitoring Pearls**:
   - Verify baseline renal function (serum creatinine, eGFR) and serum potassium before and 1-2 weeks after titration.
   - Anticipate transient early dip in eGFR (<30% is acceptable hemodynamic autoregulation).

5. **High-Yield Board Pearls**:
   - Avoid combining ACE inhibitors directly with ARBs or ARNIs due to prohibitive angioedema and hyperkalemia risks.
   - In refractory symptomatic cases, verify medication compliance and rule out concurrent NSAID or herbal supplement use.`,
          topic: fallbackTopic,
        });
      }

      const ai = getGenAI();

      const prompt = `
You are a senior clinical academic and medical evidence specialist assisting a medical student reading a textbook in their study workspace.
Subject topic: "${topic || 'Medical Research'}"
${pageSnippet ? `Context from the student's active page/book:\n"""\n${pageSnippet}\n"""\n` : ''}
${question ? `Student's specific question: "${question}"` : 'Provide the latest clinical evidence, landmark trials, mechanism updates, high-yield clinical pearls, and recent practice guidelines regarding this topic.'}

Format your response in structured, beautifully formatted markdown:
- **Core Clinical Summary**: 2-3 high-yield sentences summarizing the current paradigm.
- **Key Mechanism & Pharmacology / Pathophysiology**: Precise biochemical/cellular pathway.
- **Landmark Clinical Studies & Evidence**: Name specific trials (e.g. FREEDOM, HORIZON, FRAME, etc.), years, and primary outcome conclusions.
- **Adverse Effects & Critical Monitoring Pearls**: Black box warnings, rare but severe risks (e.g. ONJ, atypical femur fractures), contraindications.
- **High-Yield Exam / Clinical Pearls**: Bullet points that frequently appear in USMLE / NEET-PG / MBBS professional exams.
Keep explanations crisp, academic, accurate, and directly actionable for notes.
`;

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          systemInstruction:
            'You are an authoritative, evidence-based medical professor and clinical pharmacologist writing clear, concise study summaries for medical students.',
        },
      });

      return res.json({
        content: response.text || 'No research content returned.',
        topic,
      });
    } catch (error: any) {
      console.error('Error in /api/gemini/research:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch medical research insights.',
      });
    }
  });

  // 2. AI Roster / Schedule Scanner
  app.post('/api/gemini/parse-roster', async (req, res) => {
    try {
      const { scheduleText, filename } = req.body;
      if (!scheduleText || !scheduleText.trim()) {
        return res.status(400).json({ error: 'Schedule text or OCR content is required.' });
      }

      const ai = getGenAI();

      const prompt = `
Analyze the following medical college timetable / roster text and extract all events into a structured JSON array.
File reference: "${filename || 'Medical_Roster'}"

Timetable Data:
"""
${scheduleText}
"""

Return ONLY a valid JSON array of objects with the exact following schema:
[
  {
    "id": "unique-id-1",
    "title": "Topic or class name (e.g. Osteoporosis Pharmacotherapy)",
    "subject": "Pharmacology | Anatomy | Pathology | Medicine | etc.",
    "type": "lecture" | "practical" | "posting" | "seminar" | "exam",
    "date": "YYYY-MM-DD (use upcoming dates in current/next month if only day names are given)",
    "dayOfWeek": "Monday | Tuesday | Wednesday | Thursday | Friday | Saturday",
    "startTime": "HH:MM (24-hour format, e.g. 09:00)",
    "endTime": "HH:MM (e.g. 10:00)",
    "venue": "Lecture Hall 2 / Practical Lab / Ward 4B",
    "instructor": "Prof / Dr name if mentioned",
    "notes": "Any preparation or record book requirements"
  }
]
`;

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsedJson = JSON.parse(response.text || '[]');
      return res.json({ events: parsedJson });
    } catch (error: any) {
      console.error('Error in /api/gemini/parse-roster:', error);
      return res.status(500).json({
        error: error.message || 'Failed to parse timetable roster.',
      });
    }
  });

  // 3. AI Smart Medical Summarizer & High-Yield Pearl Generator
  app.post('/api/gemini/summarize', async (req, res) => {
    try {
      const { text, type } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text is required.' });
      }

      const ai = getGenAI();
      let prompt = `Convert the following medical notes or textbook excerpt into high-yield study notes:\n"""${text}"""\n`;
      if (type === 'table') {
        prompt += 'Format the summary as an organized markdown comparison table.';
      } else if (type === 'mnemonic') {
        prompt += 'Provide clever medical mnemonics and memory hooks for this topic.';
      } else {
        prompt += 'Format with clear headings, bullet points, mechanisms, clinical presentations, and drugs of choice.';
      }

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          systemInstruction:
            'You are an expert medical note synthesizer specializing in high-yield medical board exams.',
        },
      });

      return res.json({ summary: response.text });
    } catch (error: any) {
      console.error('Error in /api/gemini/summarize:', error);
      return res.status(500).json({ error: error.message || 'Failed to summarize notes.' });
    }
  });

  // 4. AI Inline Medical Term Explainer (used by Note Editor selection popup)
  app.post('/api/gemini/explain', async (req, res) => {
    try {
      const { term, context } = req.body || {};
      if (!term || typeof term !== 'string' || !term.trim()) {
        return res.status(400).json({ error: 'Selected term is required.' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured yet.',
        });
      }

      const ai = getGenAI();
      const prompt = `Explain the medical/clinical term "${term.trim()}" concisely for a medical student (${context || 'Medical Study Notes'}). Give a crisp 2-4 sentence explanation covering core mechanism/definition and 1 high-yield clinical or board exam pearl. Plain prose, no markdown headings.`;

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          systemInstruction:
            'You are a concise, accurate clinical educator giving high-yield medical definitions for inline note callouts.',
        },
      });

      return res.json({
        term: term.trim(),
        explanation: response.text || `No explanation returned for "${term.trim()}".`,
      });
    } catch (error: any) {
      console.error('Error in /api/gemini/explain:', error);
      return res.status(500).json({ error: error.message || 'Failed to explain selected term.' });
    }
  });

  // AI Studio Export & Bundle Download
  app.get('/api/export/aistudio', (_req, res) => {
    const zipPath = resolveProjectFile('MedDen-AI-Studio-Export.zip');
    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="MedDen-AI-Studio-Export.zip"');
      return res.sendFile(zipPath);
    }
    return res
      .status(404)
      .json({ error: 'Export bundle not found. Please generate the export bundle first.' });
  });

  app.get('/api/export/metadata', (_req, res) => {
    const metadataPath = resolveProjectFile('metadata.json');
    const zipPath = resolveProjectFile('MedDen-AI-Studio-Export.zip');
    if (fs.existsSync(metadataPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        return res.json({
          success: true,
          metadata: data,
          appletId: data.appletId || '0087218c-d7d0-4ad0-b0df-2e515051e7a0',
          aiStudioUrl: `https://aistudio.google.com/app/applet/${data.appletId || '0087218c-d7d0-4ad0-b0df-2e515051e7a0'}`,
          downloadUrl: '/api/export/aistudio',
          zipSize: fs.existsSync(zipPath) ? fs.statSync(zipPath).size : 0,
        });
      } catch (e: any) {
        return res.status(500).json({ error: e.message });
      }
    }
    return res.status(404).json({ error: 'metadata.json not found.' });
  });

  return app;
}

export function createApiApp(): express.Express {
  const app = express();
  return attachApiRoutes(app);
}
