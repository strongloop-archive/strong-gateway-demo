var request = require('request');

// Build the token request using client credentials grant type
var form = {
  grant_type: 'password',
  username: 'bob',
  password: 'secret',
  scope: 'demo'
};

function printRateLimitHeaders(err, res) {
  console.log('Key: %s, Limit %d Remaining: %d Reset: %d',
    res.headers['x-ratelimit-key'] || null,
    res.headers['x-ratelimit-limit'] || null,
    res.headers['x-ratelimit-remaining'] || null,
    res.headers['x-ratelimit-reset'] || null);
}

var authServerPort = process.env.PORT || 3202;
var iterations = Number(process.argv[2]) || 500;

// Request an access token
request.post({
  url: 'https://localhost:' + authServerPort + '/oauth/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  },
  // Use the client id/secret in the authorization header
  auth: {
    user: '123',
    pass: 'secret'
  },
  // Allow self-signed SSL certificates
  strictSSL: false,
  form: form
}, function(err, res, body) {
  var token = JSON.parse(body).access_token;
  console.log('Access Token: %s', token);

  // Request a resource repeatedly
  for (var i = 0; i < iterations; i++) {
    request.get('https://localhost:' + authServerPort +
      '/api/notes?access_token=' + token, {strictSSL: false},
      printRateLimitHeaders);
  }
});
