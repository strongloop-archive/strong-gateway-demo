var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var http = require('http');
var sslCert = require('./private/ssl_cert');
var https = require('https');

var app = module.exports = loopback();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

boot(app, __dirname, function(err) {
  if (err) throw err;

  app.start = function() {
    var port = app.get('port');
    var host = app.get('host');
    var httpServer = http.createServer(app).listen(port, host, function() {
      printServingMsg('http', host, port);

      var httpsOptions = app.httpsOptions = {
        key: sslCert.privateKey,
        cert: sslCert.certificate
      };
      var httpsPort = app.get('https-port');
      var httpsServer = https.createServer(httpsOptions, app).listen(
          app.httpsPort, host, function() {
        printServingMsg('https', host, httpsPort);

        app.close = function(cb) {
          app.removeAllListeners('started');
          app.removeAllListeners('loaded');
          httpServer.close(function() {
            httpsServer.close(cb);
          });
        };

        app.emit('started');
      });
    });
  };

  if (require.main === module)
    app.start();

  app.loaded = true;
  app.emit('loaded');
});

function printServingMsg(protocol, host, port) {
  var url = protocol + '://' + host + ':' + port;
  console.log('Web server listening at', url);
}
