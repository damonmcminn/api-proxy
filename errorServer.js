var http = require('http');

module.exports = http.createServer(function(req, res) {
  var message = JSON.stringify({message: 'Service does not exist'});
  res.writeHead(400, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.write(message);
  res.end();
}).listen(8081);
