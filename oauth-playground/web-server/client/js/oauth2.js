var clientId = '123';
var clientSecret = 'secret';
var clientRegistrationLoaded = false;
var baseUrl = 'https://localhost:3005';
var tokenEndpoint = baseUrl + '/oauth/token';
var authEndpoint = baseUrl + '/oauth/authorize';

// implicit flow

function implicit(clientId, scope) {
  scope = scope || 'demo';

  var authUrl = authEndpoint + '?client_id=' + clientId + '&redirect_uri='
    + getRedirectURI() + '&response_type=token&scope=' + scope + '&state=123';

  if (confirm('Redirecting to: ' + authUrl)) {
    location.replace(authUrl);
    return true;
  }
  return false;
}

// authorization code flow

function getAuthorizationCode(clientId, scope) {
  scope = scope || 'demo';

  var authUrl = authEndpoint + '?client_id=' + clientId + '&redirect_uri='
    + getRedirectURI() + '&response_type=code&scope=' + scope + '&state=123';

  if (confirm('Redirecting to: ' + authUrl)) {
    location.replace(authUrl);
    return true;
  }
  return false;
}

function getCode() {
  return getQueryParam('code');
}

function getTokenByCode(clientId, clientSecret, code, successCallback) {
  var data = 'code=' + code + '&grant_type=authorization_code&client_id='
    + clientId + '&client_secret=' + clientSecret + '&redirect_uri='
    + getRedirectURI();

  $.post(tokenEndpoint, data, successCallback);
}

// client credentials flow

function getTokenByClientCredentials(clientId, clientSecret, username, scope,
    successCallback, errorCallback) {
  scope = scope || 'demo';

  var data = 'grant_type=client_credentials&client_id=' + clientId
    + '&client_secret=' + clientSecret + '&scope=' + scope;

  if (username)
    data += '&username=' + username;

  $.post(tokenEndpoint, data, successCallback)
    .error(errorCallback);
}

// resource owner password credentials flow

function getTokenByResourceOwnerPasswordCredentials(clientId, clientSecret,
    username, password, scope, successCallback, errorCallback) {
  scope = scope || 'demo';

  var data = 'grant_type=password&client_id=' + clientId + '&client_secret='
    + clientSecret + '&username=' + username + '&password=' + password
    + '&scope=' + scope;

  $.post(tokenEndpoint, data, successCallback)
    .error(errorCallback);
}

// util

function hasQueryStrParams() {
  var queryStr = window.location.search;
  params = queryStr ? queryStr.substring(1).split('&') : [];
  return params.length !== 0;
}

function hasFragment() {
  return window.location.hash.length !== 0;
}

function getUrlWithToken(url, token) {
  return url + '?access_token=' + token;
}

function displayMessage(msg) {
  updateHtml('msg', msg);
}

function updateHtml(id, html) {
  $("#" + id).html(html);
}

function getRedirectURI() {
  return encodeURIComponent('https://localhost:3001' + location.pathname);
}

function appendHtml(id, html) {
  var current = $("#" + id).html();
  current = current ? current + html : html;
  $("#" + id).html(current);
}

function updateJson(id, jsonObject) {
  $("#" + id).html(JSON.stringify(jsonObject));
}

function getQueryParam(name) {
  var query = location.search;
  var parameters = [];
  if (query !== null && query !== '') {
    parameters = query.substring(1).split('&');
  }

  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].indexOf(name + '=') === 0) {
      var code = parameters[i].substring(name.length + 1);
      return code;
    }
  }
  return null;
}

function getAccessToken() {
  if (location.hash.length !== 0) {
    var accessToken = location.hash.substring(1);
    var index = accessToken.indexOf('access_token=', 0);
    var endIndex = accessToken.indexOf('&', index + 13);
    if (endIndex === -1)
      endIndex = accessToken.length() - 1;
    var oAuthToken = accessToken.substring(index + 13, endIndex);
    return oAuthToken;
  }
  return null;
}
