const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3003',
      changeOrigin: true,
      logLevel: 'debug',
      // Keep the /api prefix in the request path
      pathRewrite: {
        '^/api': '/api' // This ensures /api requests are sent as /api to the backend
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.method, req.url, '→', proxyReq.getHeader('host'), proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Proxy response:', proxyRes.statusCode, req.url);
      }
    })
  );
};
