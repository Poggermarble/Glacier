const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const PORT = process.env.PORT || 3000;

// Homepage with input box
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Glacier Proxy</title>
      <style>
        body {
          font-family: Arial;
          background: black;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        input {
          padding: 10px;
          font-size: 16px;
          width: 300px;
        }
        button {
          padding: 10px;
          font-size: 16px;
          margin-left: 5px;
        }
      </style>
    </head>
    <body>
      <div>
        <h2>Glacier Proxy</h2>
        <input id="url" placeholder="Enter site (e.g. roblox.com)" />
        <button onclick="go()">Go</button>
      </div>

      <script>
        function go() {
          let url = document.getElementById('url').value.trim();

          if (!url.startsWith('http')) {
            url = 'https://' + url;
          }

          window.location.href = '/proxy/' + encodeURIComponent(url);
        }
      </script>
    </body>
    </html>
  `);
});

// Proxy route
app.use('/proxy', (req, res, next) => {
  const target = decodeURIComponent(req.url.slice(1));

  return createProxyMiddleware({
    target: target,
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/': '' }
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
