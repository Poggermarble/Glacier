const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Change this to the site you want to proxy
const TARGET_SITE = 'https://example.com';

// Proxy all requests
app.use('/', createProxyMiddleware({
    target: TARGET_SITE,
    changeOrigin: true,
    secure: false, // skip SSL verification if needed
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request: ${req.method} ${req.url}`);
    }
}));

// Optional: serve your own static files if you want
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Proxy running on http://localhost:${PORT}`);
});
