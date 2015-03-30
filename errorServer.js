var http = require('http');

module.exports = http.createServer(function(req, res) {
  var message = JSON.stringify({message: 'Service not found'});
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(message);
  res.end();
}).listen(8081);
