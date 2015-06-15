# oauth-playground

This is a sample web app used to exercise [OAuth 2.0 Authorization Grant](http://tools.ietf.org/html/rfc6749#section-1.3)
flows:

- [Implicit](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Implicitgrant)
- [Authorization code](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Authorizationcodegrant)
- [Client credentials](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Clientcredentialsgrant)
- [Resource owner password credentials](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Resourceownerpasswordcredentialsgrant)

We also include sample scripts for other flows:

- [JWT Authorization Grant](scripts/jwt-client-auth.js)
- [JWT Client Authentication](scripts/jwt-auth-grant.js)

## Prerequisites

### Add the current directory to the PATH environment variable

You will need to add the current directory to the [PATH environment variable](http://en.wikipedia.org/wiki/PATH_(variable))
to run the included `build-server` scripts. Do this by adding the following to
your startup script:

```
PATH=$PATH:.
```

> We do it this way to ensure the build scripts are [cross-platform](https://en.wikipedia.org/wiki/Cross-platform)

### Tools

See the [prerequisites section in the main README](../README.md#prerequisites)

### Knowledge

- [LoopBack tutorial series](https://github.com/strongloop/loopback-example#tutorial-series)

## Overview

`oauth-playground` is an example app that demonstrates the interactions between
an API consumer, [API gateway](https://github.com/strongloop/strong-gateway),
and API server.

For more information, see [StrongLoop API Gateway documentation](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway).

The example consists of three distinct apps:

- [web-server](#web-server) - API consumer
- [strong-gateway](#strong-gateway) - API gateway
- [api-server](#api-server) - API server

The architecture is illustrated in the diagram below.

![architecture-diagram](doc/arch-diagram.png)

### `web-server`

The `web-server` is a simple web app used to access REST APIs protected by the
API gateway. Access is granted through the following [OAuth 2.0 Authorization
Grant]((http://tools.ietf.org/html/rfc6749#section-1.3) flows:

- [Implicit flow](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Implicitgrant)
- [Authorization code flow](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Authorizationcodegrant)
- [Client credentials flow](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Clientcredentialsgrant)
- [Resource password owner credentials flow](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Resourceownerpasswordcredentialsgrant)

### `strong-gateway`

The StrongLoop API Gateway is a standalone LoopBack application used to expose
and protect APIs. For more information, see [StrongLoop API Gateway documentation](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway).

### `api-server`

The `api-server` is a LoopBack app used to serve a REST API. In this case, we
serve the [`notes` model](/api-server/common/models/note.json) which has a
single property `content`.

## Run the demo

```
npm install
node .
```

---

[Other LoopBack Examples](https://github.com/strongloop/loopback-example)
