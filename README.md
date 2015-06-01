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
we serve the [`notes` model](demo-api-server/models/common/notes.json) which has
a single property `content`.

## Running the demo

1. Run `npm start` in the [project root](/). The command will start all three
apps on ports 3000 to 3005.

2. Browse to `http://localhost:3000`. Your browser will be redirected to `https://localhost:3001`
. You should see a list of links, which you can use to invoke a particular flow.

3. Choose the *implicit-flow*
