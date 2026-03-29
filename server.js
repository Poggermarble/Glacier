const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve your static files (index.html + CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint
app.use('/proxy', (req, res, next) => {
  const targetUrl = decodeURIComponent(req.url.slice(1));
  if (!targetUrl.startsWith('http')) {
    return res.status(400).send('Invalid URL');
  }

  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: '*', // bypass some cookie restrictions
    headers: {
      host: new URL(targetUrl).host
    },
    pathRewrite: { '^/proxy/': '/' }
  })(req, res, next);
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Glacier proxy running on port ${PORT}`);
});
