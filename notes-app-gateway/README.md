>Make sure you complete [part 1 of the tutorial](../notes-app-plain) before
starting this tutorial.

#notes-app-gateway

This tutorial continues from where we left off in the  [`notes-app-plain`
tutorial](../notes-app-plain).

- [Overview](#overview)
- [Setup](#setup)
- [Run](#run)
- [Tutorial](#tutorial)

##Overview

We build on `notes-app-plain` and introduce an authorization server to act as
an intermediary between the client and resource server. We will incrementally
improve on the previous tutorial over [seven steps](#tutorial) while covering a
variety of [Strongloop API Gateway](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway)
topics. The end result of the tutorial will be the transformation of
`notes-app-plain` into `notes-app-gateway`.

##Setup

- The basics from the [LoopBack tutorial series](https://github.com/strongloop/loopback-example#tutorial-series)
- Everything in the [set up section of the main README](https://github.com/strongloop/strong-gateway-demo#setup)
- Completion of [part 1 of the tutorial (`notes-app-plain`)](../notes-app-plain)

##Run

You can run any step of the tutorial by running it's corresponding
*configure-step* script from the app root. For example, to run step 1:

```
./sample-configs/step-1/configure-step
```

>We copy and remove files relative to the app root, so make sure you do not
execute the configure-step script from any other dir.

###A particular step of the tutorial

You can run the demo at any major step by running:

```
cd sample-configs/step-1
./try-demo
```

##Tutorial

We will be going through six major steps:

- [Step 1 - Proxy requests through the authorization server](#step-1)
- [Step 2 - Enable security on the authorization server](#step-2)
- Step 3 - Enable the OAuth 2.0 Authorization Code Flow on the web server
- Step 4 - `strong-gateway` policies
- Step 5 - Use MongoDB for the API gateway's data source
- Step 6 - Use MySQL for the API gateway's data source

Technically, there is a step 0, which is to copy all the files from the
previous tutorial into a new working directory. Let's start by going to the
project root root and running:

```
mkdir notes-app-gateway
cd notes-app-gateway
cp -r ../notes-app-plain/api-server api-server
cp -r ../notes-app-plain/web-server web-server
```

Your dir structure should look like:

```
notes-app-gateway
├── api-server
└── web-server
```

We'll refer to the `notes-app-gateway` dir as the *app root* from here on.

>You can run the included configuration script from the app root to perform
>these step automatically:
>
>```
>cd $APP_ROOT
>./sample-configs/step-0/configure-step
>```

###Step 1

At the moment, the client is making requests directly to the resource server:

```
+--------+     +----------+
| Client |---->| Resource |
|        |<----| Server   |
+--------+     +----------+
```

We would like to proxy requests through an authorization server instead:

```
+--------+     +---------------+     +----------+
| Client |---->| Authorization |---->| Resource |
|        |<----| Server        |<----| Server   |
+--------+     +---------------+     +----------+
```

Let's create the authorization server (auth server) using the
[StrongLoop API Gateway]().

- 1. Set up the auth server
- 2. Proxy requests to the auth server
- 3. Config the client to send reqs to the auth server
- 4. Verify proxying behaviour

####1. Set up the API Gateway

- Clone the authorization server
- Change the default authorization server gateway ports
- Change the authorization proxy ports
- Verify the port changes


#####Clone the StrongLoop API Gateway

From the app root, clone the StrongLoop API Gateway into a dir named
`gateway-server`:

```
cd $APP_ROOT
git clone https://github.com/strongloop/strong-gateway gateway-server
```

#####Change the default API gateway ports

The StrongLoop API Gateway is preconfigured to start on ports 3000 (HTTP) and
3001 (HTTPS) out-of-box.

Let's reconfigure the API gateway to start on ports 3002 (HTTP) and 3022 (HTTPS).

In the API Gateway's [`middleware.json`](sample-configs/step-1/gateway-server/middleware.json),
[change the HTTP port to 3001](sample-configs/step-1/gateway-server/config.json)
and [change the HTTPS port to 3101](sample-configs/step-1/gateway-server/config.json).

#####Change the HTTP redirection port

In `middleware.json`, change the `http-redirect` port to 3101](sample-configs/step-1/gateway-server/server/middleware.json#L31)

#####Verify the port changes

Start the gateway and verify everything works.

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

###Step 2

#### Enable security on the API gateway

At this point, everything is working properly but requests to the API
gateway are still unauthenticated. Only authenticated users should be allowed to
access notes from the API server.

#####1. Set up HTTPS on the web server

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
