var authServer = require('./auth-server');
var client = require('./client');
var resourceServer = require('./resource-server');

authServer.set('port', 3001);
authServer.set('https-port', 3101);
authServer.set('url', 'https://localhost:3101');

authServer.once('loaded', function() {
  authServer.start();
  resourceServer.start();
  client.start();
});
