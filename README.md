>**A [StrongLoop license](#obtain-a-strongloop-license) is required for this
beta demo**.

#strong-gateway-demo

This demo contains a two-part tutorial and an example app for the [StrongLoop
API Gateway (API Gateway)](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway).

- [Overview](#overview)
  - [Tutorial](#tutorial)
    - [Part 1 (`notes-app-plain`)](#part-1-notes-app-plain)
    - [Part 2 (`notes-app-gateway`)](#part-2-notes-app-gateway)
  - [Example - `oauth-playground`](#example)
- [Setup](#setup)
- [Run](#run)

##Overview

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

---

TODO: Fix this section

- The key difference between this app and typical web apps are the actual notes
    are not stored on the web server serving the request to the user agent, but is
    stored on a separate API server instead.
  - In OAuth 2.0 terminology:
    - "Web server" is the [*client*](https://tools.ietf.org/html/rfc6749#section-1.1)
    - "API server" is the [*resource server*](https://tools.ietf.org/html/rfc6749#section-1.1)
- Both the client and resource server are build using [LoopBack](http://loopback.io/).

We will be building the client and resource server components of the
infrastructure in preparation for part 2 of the tutorial.

---

####Part 2 (`notes-app-gateway`)

[`notes-app-gateway`](notes-app-gateway) is a seven-step tutorial meant to
demonstrate various features of the StrongLoop API Gateway. In each step, we
incrementally improve on the app from part 1 of the tutorial. A variety of major
topics are covered as we work through the transformation of `notes-app-plain` to
`notes-app-gateway`. Upon completion, the app from part 1 of the tutorial will
fetch notes via the API gateway instead of directly from the API server:

```
(Browser)    (StrongLoop API Gateway)         (Web Server)            (API Server)
+-------+        +---------------+             +--------+             +----------+
| User  |----/-->| Authorization |-/api/notes->| Client |-/api/notes->| Resource |
| Agent |<-notes-| Server        |<---notes----|        |<---notes----| Server   |
+-------+        +---------------+             +--------+             +----------+
```

###Example

####`oauth-playground`

This is a web app used to demonstrate various [OAuth 2.0 Authorization Grant](http://tools.ietf.org/html/rfc6749#section-1.3)
flows:

- [Implicit](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Implicitgrant)
- [Authorization Code](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Authorizationcodegrant)
- [Client Credentials](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Clientcredentialsgrant)
- [Resource Owner Password Credentials](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer%27sGuide-Resourceownerpasswordcredentialsgrant)

We also include sample scripts for GUI-less flows:

- [JWT Authorization Grant](oauth-playground/scripts/jwt-auth-grant.js)
- [JWT Client Authentication](oauth-playground/scripts/jwt-client-auth.js)

## Setup

### Install StrongLoop

Make sure you have [StrongLoop installed](http://docs.strongloop.com/display/LB/Installing+StrongLoop):

```
npm install -g strongloop
```

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
with the `licenses` flag:

```
slc arc --licenses
```

Then log in to Arc and you'll see the "Licenses" page showing your trial
licenses. See ["Managing your licenses"](http://docs.strongloop.com/display/SL/Managing+your+licenses)
for more info.

## Run

We suggest you start at [part 1 of the tutorial](notes-app-plain) and then move
onto [part 2 of the tutorial](notes-app-gateway). If you are not interested in
the tutorials, feel free to skip directly to the [`oauth-playground` example](oauth-playground).

- [`notes-app-plain` tutorial (part 1)](notes-app-plain)
- [`notes-app-gateway` tutorial (part 2)](notes-app-gateway)
- [`oauth-playground` example](oauth-playground)

---

[Other LoopBack demos](https://github.com/strongloop/loopback-demo)
