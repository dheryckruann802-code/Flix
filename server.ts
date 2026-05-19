/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { OAuth2Client } from 'google-auth-library';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Gemini AI Setup
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Google OAuth Setup
const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn('WARNING: VITE_GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing. Google Login will fail.');
}

const oauthClient = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

app.use(express.json());

// Session management - Essential for iframe OAuth
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'flix-secret-key'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: true,      // Required for SameSite=None
  sameSite: 'none',  // Required for cross-origin iframe
  httpOnly: true,
}));

// Helper to get origin
const getOrigin = (req: express.Request) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
};

// Auth Routes
app.get('/api/auth/google/url', (req, res) => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.json({ 
      url: '/auth/demo-login', 
      isDemo: true,
      warning: 'OAuth credentials not configured' 
    });
  }

  const origin = getOrigin(req);
  const redirectUri = `${origin}/auth/callback`;
  
  const url = oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    redirect_uri: redirectUri,
    prompt: 'select_account'
  });
  
  res.json({ url });
});

app.get('/auth/demo-login', (req, res) => {
  const demoUser = {
    id: 'demo-user-' + Math.floor(Math.random() * 1000),
    username: 'Demo User',
    email: 'demo@socialflix.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    bio: 'Cinema lover testing out SocialFlix! (Demo Mode)',
    subscribers: 125,
    totalEarnings: 45,
    posts: [],
    wishlist: [],
    playlists: []
  };
  
  res.send(`
    <html>
      <head>
        <title>SocialFlix Login</title>
        <style>
          body { background: #050505; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: #111; padding: 2.5rem; border-radius: 2rem; border: 1px solid #333; text-align: center; max-width: 400px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
          h2 { margin-top: 0; font-size: 1.75rem; letter-spacing: -0.05em; text-transform: uppercase; font-weight: 900; }
          button { background: #E50914; color: white; border: none; padding: 0.85rem 2.5rem; border-radius: 1rem; font-weight: 900; cursor: pointer; margin-top: 2rem; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem; }
          button:hover { transform: scale(1.05); background: #f40a16; }
          .warning { color: #888; font-size: 0.7rem; font-weight: bold; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 0.2em; border: 1px solid #333; padding: 0.5rem; border-radius: 0.5rem; }
          p { color: #555; font-size: 0.85rem; line-height: 1.5; margin: 0; }
          .brand { color: #E50914; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="warning">OAuth Not Configured</div>
          <h2>Social<span class="brand">Flix</span></h2>
          <p>You can use this app in <strong>Demo Mode</strong> while the Google OAuth credentials are not set in the Settings menu.</p>
          <button onclick="login()">Continue as Guest</button>
        </div>
        <script>
          function login() {
            window.opener.postMessage({ type: 'AUTH_SUCCESS', user: ${JSON.stringify(demoUser)} }, '*');
            window.close();
          }
        </script>
      </body>
    </html>
  `);
});

app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
  const code = req.query.code as string;
  const origin = getOrigin(req);
  const redirectUri = `${origin}/auth/callback`;

  try {
    const { tokens } = await oauthClient.getToken({
      code,
      redirect_uri: redirectUri
    });
    
    oauthClient.setCredentials(tokens);
    
    const userInfoResponse = await oauthClient.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });
    
    const user = userInfoResponse.data as any;
    
    // Store user in session
    (req as any).session.user = {
      id: user.sub,
      username: user.name,
      email: user.email,
      avatarUrl: user.picture,
    };

    // Return postMessage script to close popup and notify app
    res.send(`
      <html>
        <body style="background: #0D0D0D; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <div style="text-align: center;">
            <h2 style="color: #E50914;">FLIX AUTH</h2>
            <p>Authentication successful. Closing window...</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/auth/me', (req, res) => {
  const session = (req as any).session;
  if (session && session.user) {
    res.json(session.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  (req as any).session = null;
  res.json({ success: true });
});

// Translation Endpoint
app.post('/api/translate', async (req, res) => {
  const { strings, targetLanguage } = req.body;
  
  if (!targetLanguage || !strings) {
    return res.status(400).json({ error: 'Missing targetLanguage or strings' });
  }

  if (targetLanguage === 'English') {
    return res.json({ translations: strings });
  }

  const prompt = `You are Judy, the cinematic AI assistant for FLIX. 
Translate the following UI strings from English to ${targetLanguage}.
Context: A modern, high-end streaming and social platform for cinema lovers. 
Style: Professional, concise, cinematic, and sleek.

INPUT STRINGS (JSON):
${JSON.stringify(strings, null, 2)}

Requirement: Return ONLY a valid JSON object mirroring the input keys with translated values. Do not explain anything.`;

  let attempts = 0;
  const maxAttempts = 3;
  let lastError = null;

  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{}');
      return res.json({ translations: result });
    } catch (error: any) {
      lastError = error;
      attempts++;
      
      const isRetryable = error.status === 503 || error.message?.includes('high demand') || error.message?.includes('503');
      
      if (isRetryable && attempts < maxAttempts) {
        const delay = Math.pow(2, attempts) * 1000;
        console.log(`Translation API high demand. Retrying in ${delay}ms... (Attempt ${attempts}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      break;
    }
  }

  console.error('Translation Error after all attempts:', lastError);
  res.status(500).json({ 
    error: 'Failed to translate', 
    message: lastError?.message || 'Unknown error',
    isHighDemand: lastError?.message?.includes('high demand')
  });
});

// Vite Middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
