var http = require('http');
var httpProxy = require('http-proxy');
var errorServer = require('./errorServer');
var services = require('./services');

var proxy = httpProxy.createProxyServer({});

http.createServer(function(req, res) {

  var target;
  var identifier = /^\/.+(?=\/)/i;
  var api = req.url.match(identifier)[0].replace('/', '').toLowerCase();
  req.url = req.url.replace(identifier, '');

  proxy.web(req, res, {
    target: services[api] ? services[api] : services.error
  });
}).listen(8080);
