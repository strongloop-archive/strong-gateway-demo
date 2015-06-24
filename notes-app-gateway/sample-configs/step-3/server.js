var authServer = require('./auth-server');
var client = require('./client');
var resourceServer = require('./resource-server');

authServer.set('port', 3002);
authServer.set('https-port', 3202);
authServer.set('url', 'https://localhost:3202');

authServer.once('loaded', function() {
  authServer.start();
  client.start();
  resourceServer.start();
});
