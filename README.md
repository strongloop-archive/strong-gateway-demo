> WARNING: Some parts of this tutorial require a [StrongLoop license](#obtain-a-strongloop-license)

# strong-gateway-demo

This demo is meant to used in conjunction with [`strong-gateway`](https://github.com/strongloop/strong-gateway).
It's intended purpose is to show you how to introduce an API gateway into a
typical web application using the [`client-server` architecture](http://simple.wikipedia.org/wiki/Client-server). For more information, see the [official `strong-gateway` documentation](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway).

## Prerequisites

### Install StrongLoop

http://docs.strongloop.com/display/LB/Installing+StrongLoop

### Minimum versions

Before starting the tutorial or trying out the demos, make sure you have the
following StrongLoop libraries installed:

```
strongloop v4.0.4 (node v0.10.36)
├── strong-arc@1.4.2 (f74d03c)
├── strong-build@2.0.2 (3221b91)
├── strong-deploy@2.2.2 (13baab4)
├── strong-pm@4.2.1 (72a249c)
├── strong-registry@1.1.5 (f46e58f)
├── strong-start@1.2.0 (e59f8b5)
├─┬ strong-supervisor@2.0.0 (4c3ac51)
│ └── strong-agent@1.6.0
├── generator-loopback@1.9.1 (5219ef1)
├── node-inspector@0.7.4
└── nodefly-register@0.3.3
```

> Check your library versions by running `slc -v` or update them by running `slc
update`.

### Obtain a StrongLoop license

To get a free 30-day trial license for this beta demo, run [StrongLoop Arc](https://strongloop.com/node-js/arc/)
as follows:

```
slc arc --licenses
```

Then login to Arc (if you have not already done so) and you'll see the
`Licenses` page showing your trial licenses.

## Overview

`strong-gateway-demo` consists of three distinct projects:

- [`notes-app-plain`](notes-app-plain)
- [`notes-app-gateway`](notes-app-gateway)
- [`oauth-playground`](oauth-playground)

### `notes-app-plain`

A basic tutorial where we build a simple web app using the typical
[`client-server` architecture](http://simple.wikipedia.org/wiki/Client-server).
The client in this case renders a list of notes after fetching them from an API
server. This will be the foundation for introducing [`strong-gateway`](https://github.com/strongloop/strong-gateway)
in the [`notes-app-gateway` tutorial](notes-app-gateway).

### `notes-app-gateway`

An in-depth tutorial on how to integrate `strong-gateway` into [the app we built
in the `notes-app-plain` tutorial](notes-app-plain). We take the existing code
from [`notes-app-plain`](notes-app-plain) and update it through a series of
["phases"](notes-app-gateway/sample-configs). Each phase is a step towards
implementing the API gateway ([`strong-gateway`](https://github.com/strongloop/strong-gateway-demo)
as an intermediary between the client and API server. Along the way, we will
also be introducing a variety of concepts:

- How to register apps and users for the API gateway
- How to configure the client app to use the API gateway
- How to set up the API gateway to act as a reverse proxy to the API server
- How to enforce security on the API gateway
- How to implement the [OAuth 2.0 Authentication Code flow](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Authorizationcodegrant)
- How to use a [`strong-gateway` policy (rate limiting)](http://docs.strongloop.com/display/LGW/Configuring+policies#Configuringpolicies-Configuringratelimiting)
- How to collect metrics from the API gateway using [StrongLoop Arc](https://strongloop.com/node-js/arc/)
- How to use a custom datasource for API gateway data/metadata persistence

### `oauth-playground`

This is a sample (no tutorial) web app used to exercise [OAuth 2.0 Authorization Grant](http://tools.ietf.org/html/rfc6749#section-1.3)
flows:

- [Implicit](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Implicitgrant)
- [Authorization code](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Authorizationcodegrant)
- [Client credentials](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Clientcredentialsgrant)
- [Resource owner password credentials](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Resourceownerpasswordcredentialsgrant)

We also include sample scripts for other flows:

- [JWT authorization grant](oauth-playground/scripts/jwt-auth-grant.js)
- [JWT client authentication](oauth-playground/scripts/jwt-client-auth.js)

## Getting started

- [I want to run the completed tutorial](notes-app-gateway)
- [I want to go through part one this tutorial to set up `notes-app-plain`](notes-app-plain)
- [I want to go through part two this tutorial to set up `notes-app-gateway`](notes-app-plain)
  - Part two depends on files from part one, but you are free to copy the files
    over if you do not want to build [`notes-app-plain`](notes-app-plain)
    beforehand
- [I want to try  out common OAuth 2.0 Authorization Grant flows](oauth-playground)

---

[Other LoopBack Examples](https://github.com/strongloop/loopback-example)
