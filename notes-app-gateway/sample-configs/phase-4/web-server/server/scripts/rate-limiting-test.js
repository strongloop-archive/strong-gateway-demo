var request = require('request');

// Build the token request using client credentials grant type
var form = {
  grant_type: 'password',
  username: 'bob',
  password: 'secret',
  scope: 'demo'
};

function printRateLimitHeaders(err, res) {
  console.log('%s: Limit %d Remaining: %d Reset: %d',
    res.headers['x-ratelimit-key'] || null,
    res.headers['x-ratelimit-limit'] || null,
    res.headers['x-ratelimit-remaining'] || null,
    res.headers['x-ratelimit-reset'] || null);
}

var port = process.env.PORT || 3005;
var count = Number(process.argv[2]) || 500;

// Request the access token
request.post({
  url: 'https://localhost:' + port + '/oauth/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  },
  // Use the client id/secret in the Authorization header
  auth: {
    user: '123',
    pass: 'secret'
  },
  // Allow self-signed SSL certs
  strictSSL: false,
  form: form
}, function(err, res, body) {
  var token = JSON.parse(body).access_token;
  console.log('Access Token: %s', token);

  // Request a protected resource in a loop
  for (var i = 0; i < count; i++) {
    request.get('https://localhost:' + port + '/api/notes?access_token='
        + token, {strictSSL: false}, printRateLimitHeaders);
  }
});
