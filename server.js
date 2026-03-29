const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve the minimal dynamic UI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Glacier Proxy</title>
        <style>
          body { font-family: sans-serif; background: #222; color: #eee; display: flex; flex-direction: column; align-items: center; padding: 50px; }
          input { width: 300px; padding: 10px; margin: 10px; }
          button { padding: 10px 20px; cursor: pointer; }
          iframe { width: 90%; height: 80vh; border: none; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Glacier Proxy</h1>
        <input type="text" id="url" placeholder="Enter URL" />
        <button onclick="load()">Go</button>
        <iframe id="frame"></iframe>
        <script>
          function load() {
            const url = encodeURIComponent(document.getElementById('url').value);
            document.getElementById('frame').src = '/proxy?url=' + url;
          }
        </script>
      </body>
    </html>
  `);
});

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

app.listen(PORT, () => console.log(`Glacier proxy running on port ${PORT}`));
