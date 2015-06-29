>**A [StrongLoop license](#obtain-a-strongloop-license) is required for this
beta demo**.

#strong-gateway-demo

This demo contains a two-part tutorial and an example app for the [StrongLoop
API Gateway](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway)
(API Gateway).

- [Overview](#overview)
  - [Tutorial](#tutorial)
    - [Part 1 - `notes-app-plain`](#part-1---notes-app-plain)
    - [Part 2 - `notes-app-gateway`](#part-2---notes-app-gateway)
  - [Example - `oauth-playground`](#example---oauth-playground)
- [Setup](#setup)
- [Run](#run)

##Overview

###Tutorial

The purpose of this two-part tutorial is to show you how to implement the API
gateway as an OAuth 2.0 solution into an existing infrastructure.

####Part 1 - `notes-app-plain`

[`notes-app-plain`](notes-app-plain) is a simple web app that renders a list of
notes:

```
Notes
--------------
- Buy eggs
- Buy milk
- Buy sausages
```

The notes in this app are not stored on the web server, but are retrieved from
a separate server (API server) instead:

```
(Web Server)     (API Server)
 +--------+      +----------+
 | Client |----->| Resource |
 |        |<-----| Server   |
 +--------+      +----------+
```

In OAuth 2.0 terminology, the web server is a ["client"](https://tools.ietf.org/html/rfc6749#section-1.1) and the API server is a ["resource server"](https://tools.ietf.org/html/rfc6749#section-1.1).
We will be building the client and resource server apps in preparation for part
2 of the tutorial.

####Part 2 - `notes-app-gateway`

[`notes-app-gateway`](notes-app-gateway) is a seven-step tutorial meant to
demonstrate various features of the StrongLoop API Gateway. In each step, we
incrementally improve on the app from part 1 and cover a variety of topics as
we work through the transformation of `notes-app-plain` to `notes-app-gateway`.
Upon completion, the client will fetch notes through the API gateway instead of
interacting directly with the API server:

```
(Web Server)       (API Gateway)        (API Server)
 +--------+      +---------------+      +----------+
 | Client |----->| Authorization |----->| Resource |
 |        |<-----| Server        |<-----| Server   |
 +--------+      +---------------+      +----------+
```

###Example - `oauth-playground`

This is a web app used to demonstrate various [OAuth 2.0 Authorization Grant](http://tools.ietf.org/html/rfc6749#section-1.3)
flows:

- [Implicit](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Implicitgrant)
- [Authorization Code](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Authorizationcodegrant)
- [Client Credentials](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Clientcredentialsgrant)
- [Resource Owner Password Credentials](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Resourceownerpasswordcredentialsgrant)

We also include sample scripts for GUI-less workflows:

- [JWT Authorization Grant](oauth-playground/scripts/jwt-auth-grant.js)
- [JWT Client Authentication](oauth-playground/scripts/jwt-client-auth.js)

## Setup

### Install StrongLoop

```
npm install -g strongloop
```

>See ["Installing StrongLoop"](http://docs.strongloop.com/display/LB/Installing+StrongLoop).

### Minimum versions

Make sure you have the following library versions:

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

>Check your library versions by running `slc -v` or update them by running `slc
update`.

### Obtain a StrongLoop license

To get a free 30-day trial license for this beta demo, run [StrongLoop Arc](https://strongloop.com/node-js/arc/)
with the "licenses" flag:

```
slc arc --licenses
```

Then log in to Arc and you'll see the "Licenses" page showing your trial
licenses.

>See ["Managing your licenses"](http://docs.strongloop.com/display/SL/Managing+your+licenses).

## Run

We suggest you start at [part 1 of the tutorial](notes-app-plain) and then move
onto [part 2 of the tutorial](notes-app-gateway). If you are not interested in
the tutorials, feel free to skip directly to the [`oauth-playground` example](oauth-playground).

- [`notes-app-plain` tutorial (part 1)](notes-app-plain)
- [`notes-app-gateway` tutorial (part 2)](notes-app-gateway)
- [`oauth-playground` example](oauth-playground)

---

[Other LoopBack demos](https://github.com/strongloop/loopback-demo)
