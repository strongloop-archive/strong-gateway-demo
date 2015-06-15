var gatewayServer = require('./gateway-server');
var apiServer = require('./api-server');
var webServer = require('./web-server');

gatewayServer.set('port', 3004);
gatewayServer.set('https-port', 3005);
gatewayServer.set('url', 'https://localhost:3005');

gatewayServer.once('loaded', function() {
  gatewayServer.once('started', function() {
    console.log('Gateway server is ready - %s', gatewayServer.get('url'));
  });
  apiServer.once('started', function() {
    console.log('API server is ready - %s', apiServer.get('url'));
  });
  webServer.once('started', function() {
    console.log('Web server is ready - %s', webServer.get('url'));
  });

  gatewayServer.start();
  apiServer.start();
  webServer.start();
});
