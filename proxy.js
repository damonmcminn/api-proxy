'use strict';

var http = require('http');
var httpProxy = require('http-proxy');
var errorServer = require('./errorServer');
var services = require('parse-config');

var proxy = httpProxy.createProxyServer({ws: true});

let server = http.createServer(function(req, res) {
  var api;
  // match on hyphens e.g. http-server
  // also allows serving files e.g. http-server/file.js
  // need to update regex to match: path/file.js but NOT /file.js
  var identifier = /^\/\w+(-)*(\w+)*/i;

  try {
    api = req.url.match(identifier).shift().replace('/', '').toLowerCase();
    // path without a trailing slash becomes an empty string
    req.url = (req.url.replace(identifier, '') || '/');
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


server.on('upgrade', function(req, socket, head) {
  // proxy.ws
});
