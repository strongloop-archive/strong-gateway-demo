var loopback = require('loopback');
var boot = require('loopback-boot');
var http = require('http');
var https = require('https');

var app = module.exports = loopback();
boot(app, __dirname, function(err) {
  if (err) throw err;

  var isMain = require.main === module;

  app.start = function() {
    var port = app.get('port');
    var host = app.get('host');
    var httpServer = http.createServer(app).listen(port, host, function() {
      if (isMain) console.log('HTTP server listening at: %s', app.get('url'));

      var sslCert = require('../../private/ssl-cert');
      var httpsOptions = {
        key: sslCert.privateKey,
        cert: sslCert.certificate
      };
      var httpsPort = app.get('https-port');
      var httpsServer = https.createServer(httpsOptions, app).listen(httpsPort, host,
          function() {
        app.emit('started');
        if (isMain) console.log('HTTPS server listening at: %s', app.get('https-url'));
      });
    });
  };

  if (isMain) app.start();
  app.loaded = true;
  app.emit('loaded');
});
