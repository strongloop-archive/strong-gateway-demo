>**A [StrongLoop license](#obtain-a-strongloop-license) is required for this
beta demo**.

#strong-gateway-demo

This demo contains a two-part tutorial and an example app for the StrongLoop API
Gateway.

- [Overview](#overview)
- [Setup](#setup)
- [Run](run)

##Overview

- [Tutorial - `notes-app-plain` and `notes-app-gateway`](#tutorial)
- [Example - `oauth-playground`](#example)

###Tutorial

The purpose of this two-part tutorial is to show you how to implement the
[StrongLoop API Gateway](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway)
as an OAuth 2.0 solution into an existing infrastructure.

####Part 1 (`notes-app-plain`)

In [part 1 of the tutorial (`notes-app-plain`)](notes-app-plain), we build an
app that simply renders a list of notes:

```
Notes
--------------
- Buy eggs
- Buy milk
- Buy sausages
```

- The key difference between this app and typical web apps are the actual notes
    are not stored on the web server serving the request to the user agent, but is
    stored on a separate API server instead.
  - In OAuth 2.0 terminology:
    - "Web server" is the [*client*](https://tools.ietf.org/html/rfc6749#section-1.1)
    - "API server" is the [*resource server*](https://tools.ietf.org/html/rfc6749#section-1.1)
- Both the client and resource server are build using [LoopBack](http://loopback.io/).

The entire infrastructure looks like this:

```
(Browser)      (Web Server)                (API Server)
+-------+       +--------+                 +----------+
| User  |---/-->| Client |---/api/notes--->| Resource |
| Agent |<------|        |<----------------| Server   |
+-------+       +--------+                 +----------+
```

####Part 2 (`notes-app-gateway`)

In part 2 of the tutorial

###Example

act as an authorization server between your client and resource server.
act as an authorization server gateway between your [client](https://tools.ietf.org/html/rfc6749#section-1.1) and API server.
This repository contains two [tutorials](https://github.com/strongloop/loopback-example#terminology)
and an [example](https://github.com/strongloop/loopback-example#terminology) for
the StrongLoop API Gateway.
> **A [StrongLoop license](#obtain-a-strongloop-license) is required to complete this beta tutorial.**

# strong-gateway-demo

This demo is meant to used in conjunction with [`strong-gateway`](https://github.com/strongloop/strong-gateway).
It's intended purpose is to show you how to introduce an API gateway into a
typical web application using the [`client-server` architecture](http://simple.wikipedia.org/wiki/Client-server). For more information, see the [official `strong-gateway` documentation](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway).

## Prerequisites

- Everything in [`prerequisites.md`](doc/prerequisites.md)

## Overview

`strong-gateway-demo` consists of three distinct projects:

- [`notes-app-plain`](notes-app-plain)
- [`notes-app-gateway`](notes-app-gateway)
- [`oauth-playground`](oauth-playground)

### `notes-app-plain`

A basic tutorial where we build a simple web application using the typical
[`client-server` architecture](http://simple.wikipedia.org/wiki/Client-server).
The client in this case renders a list of notes after fetching them from an API
server. This will be the foundation for introducing [`strong-gateway`](https://github.com/strongloop/strong-gateway)
in the [`notes-app-gateway` tutorial](notes-app-gateway).

### `notes-app-gateway`

An in-depth tutorial on how to integrate [`strong-gateway`](https://github.com/strongloop/strong-gateway)
into [the application we built in the `notes-app-plain` tutorial](notes-app-plain).
We take the existing code from [`notes-app-plain`](notes-app-plain) and update
it through a series of [*phases*](notes-app-gateway/sample-configs). Each phase
is a step towards implementing the API gateway ([`strong-gateway`](https://github.com/strongloop/strong-gateway-demo)
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

This is a sample (no tutorial) web application used to exercise [OAuth 2.0 Authorization Grant](http://tools.ietf.org/html/rfc6749#section-1.3)
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
