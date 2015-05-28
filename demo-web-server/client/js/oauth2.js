var clientId = '123';
var clientSecret = 'secret';
var clientRegistrationLoaded = false;
var baseUrl = 'https://localhost:3005';
var tokenEndpoint = baseUrl + '/oauth/token';
var authEndpoint = baseUrl + '/oauth/authorize';

// utility

function displayMessage(msg) {
  updateHtml('msg', msg);
}

function updateHtml(id, html) {
  $("#" + id).html(html);
}

// implicit flow

function implicit(clientId, scope) {
  scope = scope || "demo";
  var authUrl = authEndpoint + "?client_id="
    + clientId + "&redirect_uri=" + getRedirectURI()
    + "&response_type=token&scope=" + scope + "&state=123";

  if (confirm("Redirecting to: " + authUrl)) {
    location.replace(authUrl);
    return true;
  }
  return false;
}


function getRedirectURI() {
  // return encodeURIComponent(baseURL + location.pathname);
  return encodeURIComponent('https://localhost:3001' + location.pathname);
}

function tokenByClientCredentials(clientId, clientSecret, username, scope, tokenCallback, errorCallback) {
  scope = scope || "demo";
  var data = "grant_type=client_credentials&client_id=" + clientId
    + "&client_secret=" + clientSecret + "&scope=" + scope;

  if (username) {
    data += '&username=' + username;
  }

  $.post(tokenEndpoint, data, tokenCallback)
    .error(errorCallback);
}

function tokenByResourceOwnerPasswordCredentials(clientId, clientSecret, username, password, scope, tokenCallback, errorCallback) {
  scope = scope || "demo";
  var data = "grant_type=password&client_id=" + clientId + "&client_secret="
    + clientSecret + "&username=" + username + "&password=" + password + "&scope=" + scope;
  $.post(tokenEndpoint, data, tokenCallback)
    .error(errorCallback);
}

function tokenByCode(clientId, clientSecret, code, tokenCallback) {
  var data = "code=" + code + "&grant_type=authorization_code&client_id="
    + clientId + "&client_secret=" + clientSecret + "&redirect_uri="
    + getRedirectURI();
  $.post(tokenEndpoint, data, tokenCallback);
}
function implicitFake(clientId, scope) {
  var authUrl = authEndpoint + "?client_id="
    + clientId + "&redirect_uri=" + getRedirectURI()
    + "&response_type=token&scope=" + scope + "&state=124";

  if (confirm("Redirecting to: " + authUrl)) {
    location.replace(authUrl);
    return true;
  }
  return false;
}

function authorizationCode(clientId, scope) {
  scope = scope || "demo";
  var authUrl = authEndpoint + "?client_id="
    + clientId + "&redirect_uri=" + getRedirectURI()
    + "&response_type=code&scope=" + scope + "&state=123";
  if (confirm("Redirecting to: " + authUrl)) {
    location.replace(authUrl);
    return true;
  }
  return false;
}

function authorizationCodeFake(clientId, scope) {
  var authUrl = authEndpoint + "?client_id="
    + clientId + "&redirect_uri=" + getRedirectURI()
    + "&response_type=code&scope=" + scope + "&state=125";
  if (confirm("Redirecting to: " + authUrl)) {
    location.replace(authUrl);
    return true;
  }
  return false;
}

function getAccessToken() {
  if (location.hash.length !== 0) {
    var accessToken = location.hash.substring(1);
    var index = accessToken.indexOf("access_token=", 0);
    var endIndex = accessToken.indexOf("&", index + 13);
    if (endIndex === -1) {
      endIndex = accessToken.length() - 1;
    }
    var oAuthToken = accessToken.substring(index + 13, endIndex);
    return oAuthToken;
  }
  return null;
}

function getState() {
  //alert('in getState');
  if (location.hash.length !== 0) {
    var state = location.hash.substring(1);
    var index = state.indexOf("state=", 0);
    var endIndex = state.indexOf("&", index + 6);
    if (endIndex === -1) {
      endIndex = state.length() - 1;
    }
    var s = state.substring(index + 6, endIndex);
    return s;
  }
  return null;
}

function getCode() {
  return getQueryParam('code');
}

function getQueryParam(name) {
  var query = location.search;
  var parameters = [];

  if (query !== null && query !== "") {
    parameters = query.substring(1).split('&');
  }

  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].indexOf(name + "=") === 0) {
      var code = parameters[i].substring(name.length + 1);
      return code;
    }
  }
  return null;
}

function appendHtml(id, html) {
  var current = $("#" + id).html();
  current = current ? current + html : html;
  $("#" + id).html(current);
}

function updateJson(id, jsonObject) {
  $("#" + id).html(JSON.stringify(jsonObject));
}
