# strong-gateway-demo

```
$ git clone git@github.com:strongloop/strong-gateway-demo.git
$ cd strong-gateway-demo
$ npm start
```

## Overview

`strong-gateway-demo` is an example app that demonstrates the interactions
between the API consumer, [API gateway](https://github.com/strongloop/strong-gateway)
, and API server. The example consists of three distinct apps:

- [demo-web-server](#demo-web-server)
- [strong-gateway](#strong-gateway)
- [demo-api-server](#demo-api-server)

The architecture is illustrated in the diagram below.

![demo](docs/demo.png)

### demo-web-server

The `demo-web-server` is a simple web app used to access REST APIs protected by
the API gateway. Access is granted through any of the following flows:

- [Implicit flow](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Implicitgrant)
- [Authorization code flow](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Authorizationcodegrant)
- [Client credentials flow](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Clientcredentialsgrant)
- [Resource password owner credentials flow](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Resourceownerpasswordcredentialsgrant)

### strong-gateway

The StrongLoop API Gateway is a standalone LoopBack application used to expose
and protect APIs. See https://github.com/strongloop/strong-gateway for more
info.

### demo-api-server

The `demo-api-server` is a LoopBack app used to serve a REST API. In this case,
we serve the [`notes` model](/demo-api-server/common/models/note.json) which has
a single property `content`.

## Running the demo

1. Run `npm start` in the [project root](/). The command will start all three
apps on ports 3000 to 3005.

2. Browse to `http://localhost:3000`. Your browser will be redirected to `https://localhost:3001 `
and you should see a list of links.

3. Start by choosing the *implicit-flow*. You will see a popup asking if you
want to be redirected to the given URL (notice the query string contains all the
params expected by the API gateway). Choose *OK*.

4. At this point, your browser will be redirected to the gateway's
authentication page (notice the URL is now pointing at `https://localhost:3005` instead
of `https://localhost:3001`). Log in using the provided credentials (bob:secret) by
clicking *Submit*.

5. Once you log in, notice the URL changes to `https://localhost:3005/oauth/authorize?client_id...`
. The API gateway will then ask you to grant permissions to `demo-app`.  Click
allow to approve the grant. You will then be redirected to `https://localhost:3001/implicit-flow.html`.

6. After the redirection, notice the URL has changed to `https:://localhost:3001/implicit-flow.html#access_token=...`
. The key thing to note here is the access token embedded into the URL, which
is used to access resources protected by the API gateway. You should also see
two links on the page with access tokens embedded in their respective URLs.

7. The first link, *Access OAuth 2.0 protected resources* is a link to a
resource hosted on the local server protected by the API gateway. Click the link
and you will see that the URL has redirected you to `localhost:3001/protected/protected-apis.html...`.
What has happened here is the API gateway proxied your request back to a
resource hosted on the local server (see [client/protected/protected-apis.html](/demo-web-server/client/protected/protected-apis.html)
.

8. Click the back button in your browser to go back to the page listing the
resources. Click on the second link *Call /api/notes*.

9. You should see `[{"content":"Buy eggs","id":1},{"content":"Buy milk","id":2},{"content":"Buy sausages","id":3}]`

10. In this case, the `demo-api-server` is serving resources on `localhost:3002`.
Our request to the API gateway has been proxied to the `demo-api-server` and
the results sent back as JSON (notice the URL is `https://localhost:3005/api/notes`
instead of https://localhost:3002/api/notes`

11. That's it for the implicit flow. Click on back and then the *Home* link and
try out the other flows listed (Authorization code, Client credentials, and
Resource owner password credentials). Each flow has its own differences, see https://tools.ietf.org/html/rfc6749#section-1.3 for more info.
