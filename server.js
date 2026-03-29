const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static UI
app.use(express.static(path.join(__dirname, 'public')));

// Dynamic proxy endpoint
app.use('/proxy', (req, res, next) => {
  const target = req.query.url;
  if (!target) return res.status(400).send('Missing URL parameter');

  let validUrl;
  try { validUrl = new URL(target).toString(); }
  catch { return res.status(400).send('Invalid URL'); }

  createProxyMiddleware({
    target: validUrl,
    changeOrigin: true,
    pathRewrite: { '^/proxy': '' },
    onProxyReq(proxyReq) { console.log(`Proxying to ${validUrl}`); },
    onError(err, req, res) { res.status(500).send('Proxy error: ' + err.message); }
  })(req, res, next);
});

// Fallback to index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Glacier proxy running on port ${PORT}`));
