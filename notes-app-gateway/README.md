>Make sure you complete [part 1 of the tutorial](../notes-app-plain) before
starting this tutorial.

#notes-app-gateway

This tutorial continues from where we left off in the  [`notes-app-plain`
tutorial](../notes-app-plain).

- [Overview](#overview)
- [Setup](#setup)
- [Tutorial](#utorial)
  - [Run](#run)
  - [Build](#build)

##Overview

We build on `notes-app-plain` and introduces an authorization server to act as
an intermediary between the client and resource server. This involves going
through six major steps:

- Step 1 - How to proxy requests through the API gateway without authentication
- Step 2 - How to enable security on the API gateway
- Step 3 - How to enable the OAuth 2.0 Authorization Code flow on the web server
- Step 4 - How to use StrongLoop API Gateway policies
- Step 5 - How to use MongoDB for the API gateway's data source
- Step 6 - How to use MySQL for the API gateway's data source

In each step, we incrementally improve on `notes-app-plain` and cover various 
major topics on the way:

- How to register apps and users for the API gateway
- How to configure the client app to use the API gateway
- How to set up the API gateway to act as a reverse proxy to the API server
- How to enforce security on the API gateway
- How to implement the OAuth 2.0 Authentication Code Grant flow
- How to use a strong-gateway policy (rate limiting)
- How to collect metrics from the API gateway using StrongLoop Arc
- How to use a custom datasource for API gateway data/metadata persistence

Upon completion, we will transform `notes-app-plain` into `notes-app-gateway`.
The final architecture will look like:

```
(Browser)          (API Gateway)              (Web Server)            (API Server)
+-------+        +---------------+             +--------+             +----------+
| User  |----/-->| Authorization |-/api/notes->| Client |-/api/notes->| Resource |
| Agent |<-notes-| Server        |<---notes----|        |<---notes----| Server   |
+-------+        +---------------+             +--------+             +----------+
```

##Set up

## Prerequisites

- The basics from the [LoopBack tutorial series](https://github.com/strongloop/loopback-example#tutorial-series)
- Everything in the [set up section of the main README](https://github.com/strongloop/strong-gateway-demo#setup)
- Completion of [part 1 of the tutorial (`notes-app-plain`)](../notes-app-plain)

##Run

### The main demo (phase-4)

OSX/Linux:

```
$ try-demo
```

Windows:

```
> try-demo.cmd
```

### Go to a specific phase

OSX/Linux:

```
$ cd sample-configs/phase-1 # replace 1 with any number (ie. 2, 3, 4, ...)
$ copy-files
$ cd ../..
$ build-servers
$ node .
```

Windows:

```
> cd sample-configs\phase-1 # replace 1 with any number (ie. 2, 3, 4, ...)
> copy-files.cmd
> cd ../...
> build-servers.cmd
> node .
```

## Overview

We would like to have an API gateway sit between the web server and API server:

```
+--------+     +---------+     +--------+
| Web    |---->| API     |---->| API    |
| Server |<----| Gateway |<----| Server |
+--------+     +---------+     +--------+
```

While working through the tutorial, we will also be demonstrating a variety of
[StrongLoop API Gateway](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway)
concepts:

- How to register apps and users for the API gateway
- How to configure the client app to use the API gateway
- How to set up the API gateway to act as a reverse proxy to the API server
- How to enforce security on the API gateway
- How to implement the OAuth 2.0 Authentication Code flow
- How to use a `strong-gateway` policy ([`rate limiting`](http://docs.strongloop.com/display/LGW/Configuring+policies#Configuringpolicies-Configuringratelimiting))
- How to collect metrics from the API gateway using [StrongLoop Arc](point to docs)
- How to use a custom datasource for API gateway data/metadata persistence

## Procedure

We will begin by setting up the *default layout*, which is the basic directory
structure for each project *phase*. We will then go through each phase:

- Phase 1 - Proxy requests through the API gateway without authentication
- Phase 2 - Enable security on the API gateway
- Phase 3 - Enable the OAuth 2.0 Authorization Code Flow on the web server
- Phase 4 - `strong-gateway` policies
- Phase 5 - Use MongoDB for the API gateway's data source
- Phase 6 - Use MySQL for the API gateway's data source

### Set up the default layout

##### 1. Copy the existing web server and API server

Create a new directory to store all the files we'll be creating:

```
$ mkdir notes-app-gateway
$ cd notes-app-gateway
```

We'll refer to this directory as the *project root* from here on.  Next, copy
[the API server from `notes-app-plain`](../notes-app-plain/api-server) into the
project root:

```
$ cp -r ../notes-app-plain/api-server api-server
```

Then copy [the web server from `notes-app-plain`](../notes-app-plain/web-server)
into the project root:

```
$ cp -r ../notes-app-plain/web-server web-server
```

##### 2. Clone the gateway

Start by cloning `strong-gateway` from GitHub into the project root:

```
$ git clone https://github.com/strongloop/strong-gateway.git gateway-server
```

> Notice we clone the project into a directory named `gateway-server` instead of
the default project name.

Then install the gateway server's dependencies:

```
$ cd gateway-server
$ npm install
```

Next, remove `middleware.json` and `config.json`:

```
rm server/middleware.json
rm server/config.json
```

Your directory structure should look like:

```
notes-app-gateway
├── api-server
├── gateway-server
├── web-server
```

We'll refer to this set up as the *default layout*. Each phase starts with the
default layout. The [`sample-configs` directory](sample-configs) contains a
directory for each phase of the tutorial. Inside these directory are the file
deltas (changes) for each phase. If you need an example to refer to, thats where
you would look. In addition to the sample files, each phase directory contains a
`copy-files` script. You can always set up a phase by reseting the project to
the default layout and running the corresponding phase's `copy-files` script.
For example, if you wanted to see the end result of phase 1:

```
... # set up the default layout
cd sample-configs/phase-1
./copy-files
```

This will automatically configure everything to the last step of phase 1.

> The `copy-files` script MUST be run in it's corresponding sample-configs phase
directory. This means you MUST `cd sample-configs/phase-\*` before running
`./copy-files`.

### Phase 1

#### Proxy requests through the API gateway without authentication

At the moment, the web server is making requests directly to the API server:

```
+--------+     +--------+
| Web    |---->| API    |
| Server |<----| Server |
+--------+     +--------+
```

We will create an API gateway using `strong-gateway` and introduce it as an
intermediary between the web server and the API the server. In the new
architecture, the web server will make requests to the API gateway, which acts
as a reverse proxy to the API server as shown in the following diagram:

```
+--------+     +---------+     +--------+
| Web    |---->| API     |---->| API    |
| Server |<----| Gateway |<----| Server |
+--------+     +---------+     +--------+
```

##### 1. Reconfigure API gateway ports

We need to:

- Change the gateway server's default ports to [3004 (HTTP)](sample-configs/phase-1/gateway-server/server/config.json#L4) and [3005 (HTTPS)](sample-configs/phase-1/gateway-server/server/config.json#L6)
- [Change the `http-redirect` middleware to use port 3005](sample-configs/phase-1/gateway-server/server/middleware.json#L31)

> Out-of-box `strong-gateway` is preconfigured to start on ports 3000 (HTTP) and
3001 (HTTPS). This conflicts with [the web server's default port from the
previous tutorial](../notes-app-plain/web-server/server/config.json#L4).

To do this, copy the sample [middleware.json](sample-configs/phase-1/gateway-server/server/middleware.json)
and [config.json](sample-configs/phase-1/gateway-server/server/config.json) to
the `gateway-server/server` directory:

```
cp sample-configs/phase-1/gateway-server/server/middleware.json ../gateway-server/server/middleware.json
cp sample-configs/phase-1/gateway-server/server/config.json ../gateway-server/server/config.json
```

> We also provide a [`copy-files` script](sample-configs/phase-1/copy-files)
for convenience sake.

Verify the port changes are working by starting the API gateway:

```
node gateway-server
```

Then browse to `localhost:3004` and you should see in the URL bar that you've
been redirected to `localhost:3005` and the default `strong-gateway` home page
should be loaded:

```
StrongLoop API Gateway

Documentation
http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway

Demo
https://github.com/strongloop/strong-gateway-demo
```

Stop the server when you're done verifying the results.

##### 2. Proxy API gateway requests to the API server.

By default, the API gateway is already [configured to proxy requests to the API
server on port 3002](sample-configs/phase-1/gateway-server/server/middleware.json#L36-L42).
We won't need to make any changes at this time because we've [already set the
API server port to 3002 in the previous tutorial](../notes-app-plain/api-server/server/config.json#L4).

##### 3. Configure the web server to send requests to the API gateway

Change the [request URL port to 3004 `server/boot/route.js`](sample-configs/phase-1/web-server/server/boot/routes.js#L8).

##### 4. Test it out

Start the API server:

```
node api-server
```

You should see it load on port 3002. In a new tab, start the gateway:

```
node gateway-server
```

You should see it start on port 3004 for HTTP and 3005 for HTTPS. In a third
tab, start the web server:

```
node web-server
```

You should see everything loading exactly the same as before:

```
Notes
--------------
- Buy eggs
- Buy milk
- Buy sausages
```

In contrast to the previous architecture, the web server now fetches data
through the API gateway, which in turn fetches data from the API server. The
web server is now fully decoupled from the API server.

> We provide [`a startup script`](./server.js) to help start up all three
servers at once. Execute `node server.js` from the project root and you should
see all three servers loading at once.

### Phase 2

#### Enable security on the API gateway

At this point, everything is working properly but requests to the API
gateway are still unauthenticated. Only authenticated users should be allowed to
access notes from the API server.

##### 1. Set up HTTPS on the web server

Copy the sample SSL certificates:

```
cp -r sample-configs/phase-2/web-server/server/private/ web-server/server/private
```

Then modify [`server.js` to start an HTTPS server on port 3001](sample-configs/phase-2/web-server/server/server.js#L1-L58). Additionally, you will need to copy the [`https-redirect`
middleware`](sample-configs/phase-2/web-server/server/middleware/https-redirect) to the
web server's `middleware` directory:

```
cp -r sample-configs/phase-2/web-server/server/middleware web-server/server/middleware
```

Next, add a [`routes:before` section in the web server's `middleware.json` to
register the middleware we just copied](sample-configs/phase-2/web-server/server/middleware.json#L22-L28).

> Notice the middleware is [configured to redirect requests to `httpsPort` 3001](sample-configs/phase-2/web-server/server/middleware.json#L25).

Finally, [add the `url` key to `config.json`](sample-configs/phase-2/web-server/server/config.json#L27).

##### 2. Verify web server requests are being redirected to HTTPS

Start the web-server:

```
node web-server
```

Browse to [`http://localhost:3000`](http://localhost:3000) and check the URL bar
to see if you've been redirected to `https://localhost:3001`. Shut down the
server once you're done verifying the results.

##### 3. Enable security on the API gateway

Add the [`loopback-component-oauth2` configurations to the `auth` section to the
gateway's middleware.json](sample-configs/phase-2/gateway-server/server/middleware.json#L27-L48).

##### 4. Test it out

To prove the security is working, start up all three servers again and browse
to [`http://localhost:3000`](http://localhost:3000). As usual, the web server
will try to make a request to fetch notes again, but will fail this time. If
everything worked properly, you should be redirected to `https://localhost:3001`
and you should see:

```
401

Unauthorized
```

### Phase 3

#### Enable the OAuth 2.0 Authorization Code Flow on the web server

Since the API server is now blocking the web server from retrieving notes, we
need to configure a way to authenticate on the API gateway. We will use the
[OAuth 2.0 Authorization Code Grant](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Authorizationcodegrant)
flow to do this.

##### 1. Render then unauthorized view for the `/` route

On the web server, create a [new view named `unauthorized.ejs`](sample-configs/phase-3/web-server/server/views/unauthorized.ejs)

Then [modify the `/` route to render this view](sample-configs/phase-3/web-server/server/boot/routes.js#L6-L8).

##### 2. Create a link to start the authentication flow

In the `unauthorized` view, [create a link to start OAuth 2.0 Authorization Code Grant](sample-configs/phase-3/web-server/server/views/unauthorized.ejs#L3)
flow.

##### 3. Retrieve the authentication code

Create a [handler to retrieve an authentication code from the API
gateway](sample-configs/phase-3/web-server/server/boot/routes.js#L10-L19).
The handler will [redirect the user to the authentication
URL](sample-configs/phase-3/web-server/server/boot/routes.js#L18)
on the API gateway to log in. Upon completion, the API gateway will
respond with the authorization code at the specified [`redirectUri`](sample-configs/phase-3/web-server/server/boot/routes.js#L13).

##### 4. Create a handler for the API gateway response

[Create the `/token` endpoint to handle the API gateway authentication response](sample-configs/phase-3/web-server/server/boot/routes.js#L21-L52). You will also need to create the [helper functions to retrieve the access token and notes](sample-configs/phase-3/web-server/server/boot/routes.js#L57-L78).

Notice we [get the authentication code from the query string and use it to
retrieve an access
token](sample-configs/phase-3/web-server/server/boot/routes.js#L22)
from the API gateway.

Once the server receives a valid authorization code, it will respond with an
access token.  We then we send [another request to the API gateway using this
token retrieve the notes](sample-configs/phase-3/web-server/server/boot/routes.js#L36).

When the notes are returned to the web server, we [render the index page and
display it usual](sample-configs/phase-3/web-server/server/boot/routes.js#L49).

##### 5. Try it out

Start all three servers again and browse to [`localhost:3000`](http://localhost:3000).
Click the authentication link and respond to the questions and eventually you
will see the same page of notes again.

> Notice the user `bob` is already registered for you when going through the
authentication flow. This is because [`strong-gateway` automatically registers
this sample user](https://github.com/strongloop/strong-gateway/tree/master/server/boot/create-sample-data.js#L2-L5)
when not run in production mode (ie. NODE_ENV=prod). Also take a look at
[`sample-data.json`](https://github.com/strongloop/strong-gateway/tree/master/server/sample-data.json)
for more info.

### Phase 4

#### `strong-gateway` policies

While the main purpose of API gateways are typically authentication and
authorization, `strong-gateway` also provides several auditing features out-of-box known as ["policies"](http://docs.strongloop.com/display/LGW/Configuring+policies).
Let's try some out using the existing API gateway.

##### Rate limiting

[Rate limiting](http://docs.strongloop.com/display/LGW/Configuring+policies#Configuringpolicies-Configuringratelimiting) is used to control the number of API calls from clients within a certain period of time.

###### 1. Set up the API gateway to use rate limiting

In the `routes:after` section of the API gateway's `middleware.json`, [configure
the rate limiting middleware](sample-configs/phase-4/gateway-server/server/middleware.json#L58-L82).

###### 2. Create the `rate-limiting-client` script

[Create a helper script named
`rate-limiting-client`](sample-configs/phase-4/web-server/server/scripts/rate-limiting-client.js). We will use this script to
make a large number of requests and print the responses returned by the API
gateway.

###### 3. Try it out

Start the API gateway:

```
note gateway-server
```

Then run the `rate-limiting-test` script:

```
PORT=3005 node web-server/server/scripts/rate-limiting-test
```

You should see output like:

```
...
url-api/notes: Limit 1000 Remaining: 999 Reset: 60000
url-api/notes: Limit 1000 Remaining: 998 Reset: 60000
url-api/notes: Limit 1000 Remaining: 997 Reset: 60000
url-api/notes: Limit 1000 Remaining: 996 Reset: 59982
url-api/notes: Limit 1000 Remaining: 995 Reset: 59980
...
```

Notice the headers show the number of remaining requests (999, 998, ...) and the
time left until that count resets in milliseconds (60000, 59982, ...). For more

##### API Metrics

> A subscriber license is required for this part of the tutorial. Please contact
sales to obtain a trial license if you do not have a subscription. Otherwise,
skip to phase 5.

Another useful feature of `strong-gateway` is the ability to gather metrics
related to API usage. This is possible due to `strong-express-metrics`
middleware bundled with `strong-gateway`. We will also be using `strong-arc` to
view the metrics.

###### 1. Start the gateway server using `strong-arc`

```
cd gateway-server
slc arc
```

At this point, `strong-arc` will automatically open your browser. Go to the
metrics page and click the "app controller" button on the top right corner of
the screen. Then click the play button in the drop down menu to start
`strong-gateway` on port 3004.

###### 2. Load the metrics screen

Click the "Load" button on the left side of the screen. Once the metrics have
loaded, you should see two processes running. After a few seconds, you should
see a number of graphs load in the main content area. `strong-arc` is now ready
to gather metrics.

###### 3. Make some API requests

To create some metrics for `strong-arc` to gather, we'll reuse the
[`rate-limiting-test` script from the previous section](sample-configs/phase-4/web-server/server/scripts/rate-limiting-test.js):

```
node web-server/server/scripts/rate-limiting-test
```

This will simply make a large number of requests, which in turn will cause
`strong-arc` to gather metrics.

###### 4. Verify the metrics gathered by `strong-arc`

Go back to the `strong-arc` window and view the metrics. You should see a number
of changes in the various graph outputs. See the [official `strong-arc`
documentation](http://docs.strongloop.com/display/SLC/Metrics+API#MetricsAPI-Availablemetrics)
for information on how to read the outputs.


### Choosing a datasource for the `strong-gateway` data/metadata

Throughout the tutorial, the API gateway has been using the in-memory database
to persist data/metadata. In production, you will want to choose a specific
datasource to store your information. Since `strong-gateway` is built using
LoopBack, it supports all the same data sources types (Microsoft SQL Server,
MongoDB, MySQL, Oracle, and PostgreSQL). We'll demonstrate one NoSQL (MongoDB)
and one relational database (MySQL) in this tutorial.

- Datasources.json in gateway
- Run setudb.js to create tables for relational db
- Point to he docs for other types of datasources

#### Phase 5

##### Use MongoDB for the API gateway's data source

Make sure you have MongoDB running on your machine. Start it using the default
port 27017.

Then change to the [`gateway-server directory`](gateway-server) and install
`loopback-connector-monogdb`:

```
cd gateway-server
npm install --save loopback-connector-mongodb
```

Then start all three servers again and take a look at your MongoDB collections.
Notice there are five collections created:

- OAuthAccessToken
- OAuthAuthorizationCode
- OAuthClientApplication
- OAuthPermission
- User

These collections are automatically set up by `strong-gateway`.

#### Phase 6

##### Use MySQL for the API gateway's data source

Make sure you have MySQL running on your machine. Start it using the default
port 3306.

Then change to the [`gateway-server` directory](gateway) and install
`loopback-connector-mysql`:

```
cd gateway-server
npm install --save loopback-connector-mysql
```

Next, [create `setup-db.js` script](sample-configs/gateway-server/server/scripts/setup-db.js).

Run the script to create all the tables required by `strong-gateway`:

```
node gateway-server/server/scripts/setup-db.js
```

Then start all three servers again and take a look at your MySQL tables.  Notice
there are five tables created:

- OAuthAccessToken
- OAuthAuthorizationCode
- OAuthClientApplication
- OAuthPermission
- User

These tables are automatically created by [`setup-db` script](server-configs/phases-6/gateway-server/server/scripts/setup-db.js).

---

[Other LoopBack Examples](https://github.com/strongloop/loopback-example)
