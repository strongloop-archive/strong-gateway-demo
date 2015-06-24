var apiServer = require('./api-server');
var webServer = require('./web-server');

apiServer.once('started', function() {
  console.log('API server is ready - %s', apiServer.get('url'));
});
webServer.once('started', function() {
  console.log('Web server is ready - %s', webServer.get('url'));
});

apiServer.start();
webServer.start();
