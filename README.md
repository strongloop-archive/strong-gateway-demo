>**A [StrongLoop license](#obtain-a-strongloop-license) is required for this
beta demo**.

#strong-gateway-demo

This demo contains a two-part tutorial and an example app for the [StrongLoop
API Gateway](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway),
which we'll refer to as the API gateway from here on.

- [Overview](#overview)
- [Setup](#setup)
- [Run](run)

##Overview

- [Tutorial - `notes-app-plain` and `notes-app-gateway`](#tutorial)
- [Example - `oauth-playground`](#example)

###Tutorial

The purpose of this two-part tutorial is to show you how to implement the API
gateway as an OAuth 2.0 solution into an existing infrastructure.

####Part 1 (`notes-app-plain`)

[`notes-app-plain`](notes-app-plain) is a simple web app that renders a list of
notes:

```
Notes
--------------
- Buy eggs
- Buy milk
- Buy sausages
```

It's infrastructure looks like this:

```
(Browser)               (Web Server)                (API Server)
+-------+                +--------+                 +----------+
| User  |--------/------>| Client |---/api/notes--->| Resource |
| Agent |<-----notes-----|        |<-----notes------| Server   |
+-------+                +--------+                 +----------+
```

- The key difference between this app and typical web apps are the actual notes
    are not stored on the web server serving the request to the user agent, but is
    stored on a separate API server instead.
  - In OAuth 2.0 terminology:
    - "Web server" is the [*client*](https://tools.ietf.org/html/rfc6749#section-1.1)
    - "API server" is the [*resource server*](https://tools.ietf.org/html/rfc6749#section-1.1)
- Both the client and resource server are build using [LoopBack](http://loopback.io/).

We will be building the client and resource server components of the
infrastructure in preparation for part 2 of the tutorial.

####Part 2 (`notes-app-gateway`)

[`notes-app-gateway`](notes-app-gateway) is comprehensive tutorial consisting of
six major steps:

- Step 1 - How to proxy requests through the API gateway without authentication
- Step 2 - How to enable security on the API gateway
- Step 3 - How to enable the OAuth 2.0 Authorization Code flow on the web server
- Step 4 - How to use StrongLoop API Gateway policies
- Step 5 - How to use MongoDB for the API gateway's data source
- Step 6 - How to use MySQL for the API gateway's data source

In each step, we incrementally improve on the app from part 1 of the tutorial.
Various major topics are covered as we work through the transformation of
`notes-app-plain` to `notes-app-gateway`. Along the way, we will also be
demonstrating a variety of StrongLoop API Gateway concepts:

 - How to register apps and users for the API gateway
 - How to configure the client app to use the API gateway
 - How to set up the API gateway to act as a reverse proxy to the API server
 - How to enforce security on the API gateway
 - How to implement the OAuth 2.0 Authentication Code flow
 - How to use a strong-gateway policy (rate limiting)
 - How to collect metrics from the API gateway using StrongLoop Arc
 - How to use a custom datasource for API gateway data/metadata persistence

Upon completion, the app from part 1 of the tutorial will fetch notes via the
API gateway instead of directly from the API server:

```
(Browser)          (API Gateway)              (Web Server)            (API Server)
+-------+        +---------------+             +--------+             +----------+
| User  |----/-->| Authorization |-/api/notes->| Client |-/api/notes->| Resource |
| Agent |<-notes-| Server        |<---notes----|        |<---notes----| Server   |
+-------+        +---------------+             +--------+             +----------+
```

###Example

#### `oauth-playground`

This is a sample (no tutorial) web application used to exercise [OAuth 2.0 Authorization Grant](http://tools.ietf.org/html/rfc6749#section-1.3)
flows:

- [Implicit](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Implicitgrant)
- [Authorization code](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Authorizationcodegrant)
- [Client credentials](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Clientcredentialsgrant)
- [Resource owner password credentials](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Resourceownerpasswordcredentialsgrant)

We also include sample scripts for other flows:

- [JWT authorization grant](oauth-playground/scripts/jwt-auth-grant.js)
- [JWT client authentication](oauth-playground/scripts/jwt-client-auth.js)

## Setup

- Everything in [`prerequisites.md`](doc/prerequisites.md)


## Run

- [I want to run the completed tutorial](notes-app-gateway)
- [I want to go through part one this tutorial to set up `notes-app-plain`](notes-app-plain)
- [I want to go through part two this tutorial to set up `notes-app-gateway`](notes-app-plain)
  - Part two depends on files from part one, but you are free to copy the files
    over if you do not want to build [`notes-app-plain`](notes-app-plain)
    beforehand
- [I want to try  out common OAuth 2.0 Authorization Grant flows](oauth-playground)

For more information, see the [official `strong-gateway` documentation](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway).

---

[Other LoopBack Examples](https://github.com/strongloop/loopback-example)
