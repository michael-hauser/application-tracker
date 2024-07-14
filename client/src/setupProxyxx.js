const { createProxyMiddleware } = require('http-proxy-middleware');
const { server } = require('./config');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: server,
      changeOrigin: true,
    })
  );
};