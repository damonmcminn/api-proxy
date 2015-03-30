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
    api = req.url.match(identifier)[0].replace('/', '').toLowerCase();
    req.url = req.url.replace(identifier, '');
    req.headers['api-proxy-prefix'] = api;
  } catch (e) {
    api = 'error';
  }

  proxy.web(
    req,
    res,
    {target: services[api] ? services[api] : services.error},
    function(e) {
      res.writeHead(500, {'Access-Control-Allow-Origin': '*'});
      res.end();
    });

}).listen(8080);
