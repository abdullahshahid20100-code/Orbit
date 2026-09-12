import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory data store for backend API validation & sync
  const registeredUsernames = new Set([
    'abdullahshahid',
    'shahidiqbal',
    'elenarostova',
    'marcusv',
  ]);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Orbit', timestamp: new Date().toISOString() });
  });

  // 1. Unique Username Validation Endpoint
  app.get('/api/auth/check-username', (req, res) => {
    const username = (req.query.username as string || '').trim().toLowerCase();
    const exclude = (req.query.exclude as string || '').trim().toLowerCase();

    if (!username) {
      return res.status(400).json({ valid: false, error: 'Username is required' });
    }
    if (username.length < 3) {
      return res.status(400).json({ valid: false, error: 'Username must be at least 3 characters' });
    }
    if (username.length > 25) {
      return res.status(400).json({ valid: false, error: 'Username must be under 25 characters' });
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
      return res.status(400).json({ valid: false, error: 'Only letters, numbers, underscores, and dots allowed' });
    }

    if (username !== exclude && registeredUsernames.has(username)) {
      return res.json({ valid: false, available: false, error: 'Username already taken' });
    }

    return res.json({ valid: true, available: true });
  });

  // Register username
  app.post('/api/auth/register-username', (req, res) => {
    const username = (req.body.username || '').trim().toLowerCase();
    if (!username || username.length < 3) {
      return res.status(400).json({ success: false, error: 'Invalid username' });
    }
    if (registeredUsernames.has(username)) {
      return res.status(409).json({ success: false, error: 'Username already taken' });
    }
    registeredUsernames.add(username);
    return res.json({ success: true, username });
  });

  // Chat Privacy Verification API
  // Rule: Users CANNOT send messages unless the recipient has accepted their follow request
  app.post('/api/chat/verify-permission', (req, res) => {
    const { senderFollowsRecipientAccepted } = req.body;
    if (!senderFollowsRecipientAccepted) {
      return res.status(403).json({
        allowed: false,
        error: 'Privacy Restriction: You cannot send messages until the other person accepts your follow request.',
      });
    }
    return res.json({ allowed: true });
  });

  // Vite middleware for development
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Orbit] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
