const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

// parse JSON bodies for POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the front-end UI (if you have a public folder)
app.use(express.static('public'));

// Proxy endpoint for dynamic URLs
app.all('/proxy', (req, res, next) => {
  const target = req.query.url || req.body.url;

  if (!target) {
    return res.status(400).send('Missing URL parameter');
  }

  // Validate URL
  let validUrl;
  try {
    validUrl = new URL(target).toString();
  } catch (err) {
    return res.status(400).send('Invalid URL');
  }

  createProxyMiddleware({
    target: validUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // remove /proxy from path
      return path.replace(/^\/proxy/, '');
    },
    onProxyReq(proxyReq, req, res) {
      console.log(`Proxying request: ${req.method} ${req.originalUrl} -> ${validUrl}`);
    },
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Glacier dynamic proxy running on port ${PORT}`);
});
