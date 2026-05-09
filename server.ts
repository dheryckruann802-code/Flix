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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Google OAuth Setup
const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
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

// Auth Routes
app.get('/api/auth/google/url', (req, res) => {
  const origin = req.headers.origin || `https://${req.headers.host}`;
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

app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
  const code = req.query.code as string;
  const origin = `https://${req.headers.host}`;
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
