var http = require('http');
var httpProxy = require('http-proxy');
var errorServer = require('./errorServer');
var services = require('./services');

var proxy = httpProxy.createProxyServer({});

http.createServer(function(req, res) {
  var target;
  var api;
  var identifier = /^\/.+(?=\/)/i;

  try {
    // match requires trailing slash => /nutrition/
    api = req.url.match(identifier).shift().replace('/', '').toLowerCase();
    req.url = req.url.replace(identifier, '');
    req.headers['api-proxy-prefix'] = api;
  } catch (e) {
    api = 'error';
  }

  proxy.web(
    req,
    res,
    {target: services[api] ? services[api] : services.error},
    // Error callback
    function(e) {
      console.error((new Date).toISOString(), e.message);
      delete e.address;
      delete e.port;
      var errorMsg = JSON.stringify(e);
      res.writeHead(500, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
      res.write(errorMsg);
      res.end();
    });

}).listen(8080);
