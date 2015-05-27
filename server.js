var gatewayServer = require('strong-gateway');
var apiServer = require('./demo-api-server');
var webServer = require('./demo-web-server');

gatewayServer.set('port', 3004);
gatewayServer.set('https-port', 3005);
gatewayServer.set('url', 'https://localhost:3005');

gatewayServer.once('loaded', function() {
  gatewayServer.once('started', function() {
    console.log('Gateway server is ready - %s', gatewayServer.get('url'));
  });
  apiServer.once('started', function() {
    console.log('Demo API server is ready - %s', apiServer.get('url'));
  });
  webServer.once('started', function() {
    console.log('Demo Web server is ready - $s', webServer.get('url'));
  });

  gatewayServer.start();
  apiServer.start();
  webServer.start();
});
