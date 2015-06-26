>Make sure you complete [part 1 of the tutorial](../notes-app-plain) before
starting this tutorial.

#notes-app-gateway

This tutorial continues from where we left off in the  [`notes-app-plain`
tutorial](../notes-app-plain).

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Run](#run)
- [Tutorial](#tutorial)

##Overview

We build on `notes-app-plain` and introduce an authorization server (auth
server) to act as an intermediary between the client and resource server. We
will incrementally improve on the previous tutorial over [seven steps](#tutorial)
while covering a variety of [Strongloop API Gateway](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway)
topics. The end result of the tutorial will be the transformation of
`notes-app-plain` into `notes-app-gateway`.

##Prerequisites

- Completion of the [LoopBack tutorial series](https://github.com/strongloop/loopback-example#tutorial-series)
- Knowledge of [StrongLoop Process Manager (PM)](http://docs.strongloop.com/display/SLC/Using+Process+Manager)
- Everything in the [setup section of the main README](https://github.com/strongloop/strong-gateway-demo#setup)
- Completion of [part 1 of the tutorial (`notes-app-plain`)](../notes-app-plain)

##Run

You can run any step of this tutorial by executing it's corresponding
*install* script from the [app root (ie. the `notes-app-gateway` dir)]().
For example, to run step 1:

```
cd notes-app-gateway
./sample-configs/step-1/install
```

>We copy and remove files relative to the app root, so make sure you do not
execute the install script from any other dir.

We recommend running step 5 to view the completed demo.

>To run steps 6 or 7, you need to start the corresponding database for that
>particular step before executing it's install script.

##Tutorial

There are five main steps and two optional steps:

- [Step 1 - Copy files from `notes-app-plain` to `notes-app-gateway`](#step-1---copy-files-from-notes-app-plain-to-notes-app-gateway)
- [Step 2 - Proxy requests through the auth server](#step-2---proxy-requests-through-the-auth-server)
- [Step 3 - Enable security on the auth server](#step-3---enable-security-on-the-auth-server)
- [Step 4 - Enable the OAuth 2.0 Authorization Code flow on the client](#step-4---enable-the-oauth-20-authorization-code-flow-on-the-client)
- [Step 5 - StrongLoop API Gateway policies](#step-5---strongloop-api-gateway-policies)
- [Step 6 (optional) - Use MongoDB for the auth server's data source](#step-6---use-mongodb-for-the-auth-servers-data-source)
- [Step 7 (optional) - Use MySQL for the auth server's data source](#step-7---use-mysql-for-the-auth-servers-data-source)

###Step 1 - Copy files from `notes-app-plain` to `notes-app-gateway`

####Copy the resource server and client

Copy the resource server and client from `notes-app-plain` into a new working
dir named `notes-app-gateway`:

```
mkdir notes-app-gateway
cd notes-app-gateway
cp -r ../notes-app-plain/resource-server resource-server
cp -r ../notes-app-plain/client client
```

Your dir structure should look like:

```
notes-app-gateway
├── client
└── resource-server
```

We'll refer to the `notes-app-gateway` dir as the *app root* from here on.

####Install deps

Install resource server and client deps:

````
cd resource-server
npm install
cd ../client
npm install
cd .. # change back to the app root
```

####Try it out

Start both servers:

```
cd resource server
slc start
slc ctl set size 1 1
cd .. # change back to the app root
node client
```

You should see:

```
Notes
------------
- Buy eggs
- Buy milk
- Buy sausages
```

Stop the servers when you're done verifying the results.

>You can set up this step automatically by executing `./sample-configs/step-1/install`
from the app root.

###Step 2 - Proxy requests through the auth server

At the moment, the client is making requests directly to the resource server:

```
+--------+     +----------+
| Client |---->| Resource |
|        |<----| Server   |
+--------+     +----------+
```

We want to [proxy](https://en.wikipedia.org/wiki/Proxy) requests through an
authorization server instead:

```
+--------+     +---------------+     +----------+
| Client |---->| Authorization |---->| Resource |
|        |<----| Server        |<----| Server   |
+--------+     +---------------+     +----------+
```

####Set up the auth server

#####Clone the auth server

From the app root, clone the [StrongLoop API Gateway](https://github.com/strongloop/strong-gateway)
into a dir named `auth-server`:

```
git clone https://github.com/strongloop/strong-gateway auth-server
```

Install the auth server's deps:

````
cd auth-server
npm install
cd .. # change back to the app root
```

#####Change the default auth server ports

Modify the auth server's `config.json` to use ports [3002 (HTTP)](sample-configs/step-2/auth-server/server/config.json#L4)
and [3202 (HTTPS)](sample-configs/step-2/auth-server/server/config.json#L6-L7).

>We do not not use the default auth server ports because we want to assign
consistent ports throughout the entire demo.

#####Remove unused portions of `middleware.json`

Remove [`auth`](sample-configs/step-2/auth-server/server/middleware.json#L26-27)
and [`rate-limiting-policy`](sample-configs/step-2/auth-server/server/middleware.json#L35-43)
values from the auth server's `middleware.json`.

>We will explain these values and add the sections back in a later step.

#####Change the `https-redirect` middleware port

Change the [`http-redirect` middleware port to 3202](sample-configs/step-2/auth-server/server/middleware.json#L31).

#####Verify the port changes

Start the auth server:

```
node auth-server
```

Browse to `localhost:3002`. You should be redirected to `localhost:3202` and you
should see:

```
StrongLoop API Gateway

Documentation
http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway

Demo
https://github.com/strongloop/strong-gateway-demo
```

Stop the server when you're done verifying the results.

>You may see a browser warning because we are using self-signed certificates.

####Proxy auth server requests to the resource server

Change the [proxy rule port to 3001 in `middleware.json`](sample-configs/step-2/auth-server/server/middleware.json#L39).

####Send client requests to the auth server

Change the [request URL port to 3002](sample-configs/step-2/client/server/boot/routes.js#L8)
and set the [`strictSSL` setting to `false`](sample-configs/step-2/client/server/boot/routes.js#L9)
in `client/server/boot/routes.js`.

####Try it out

Start all three servers (resource server and the auth server using PM, client
using regular node):

```
cd resource-server
slc start
slc ctl set-size 1 1
cd ../auth-server
slc start
slc ctl set-size 2 1
cd ..
node client
```

Browse to `localhost:2001` and you should see:

```
Notes
--------------
- Buy eggs
- Buy milk
- Buy sausages
```

While the results look identical to `notes-app-plain`, the client is now making
requests to the auth server, which is acting as a proxy to the resource server.
The client is now fully decoupled from the resource server.

Shutdown all the servers when you're done verifying the results.

>You can set up this step automatically by executing `./sample-configs/step-2/install`
from the app root.

###Step 3 - Enable security on the auth server

At this point, requests are being proxied properly, but we do not enforce any
type of security on auth server. Only authenticated users should be allowed to
access to the notes stored on the resource server.

####Configure the `loopback-component-oauth2` middleware

[Configure the `loopback-component-oauth2` middleware](sample-configs/step-3/auth-server/server/middleware.json#L27-48)
in `auth-server/server/middleware.json`.

####Try it out

[Start up all the servers](#try-it-out-1) again and browse to `localhost:2001`.
You should see:

```
401

Unauthorized
```

The server is now denying requests from unauthorized users.

>You can set up this step automatically by executing `./sample-configs/step-3/install`

###Step 4 - Enable the OAuth 2.0 Authorization Code flow on the client

Since the API server is now blocking the web server from retrieving notes, we
need to configure a way to authenticate on the API gateway. We will use the
[OAuth 2.0 Authorization Code Grant](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Authorizationcodegrant)
flow to do this.

1. [Set up HTTPS on the client](#1---setup-https-on-the-client)

####1. Set up HTTPS on the client

Create a new dir named `private` in `client/server`:

```
mkdir client/server/private
```

Copy all the [provided SSL certificate files](sample-configs/step-3/client/server/private)
into the `private` dir.

```
cp -r sample-configs/step-3/client/server/private/ client/server/private
```

Modify [`server.js` to start an HTTPS server](sample-configs/step-3/client/server/server.js#L21-L36).

Set [`https-port` to 2101 in `config.json`](sample-configs/step-3/client/server/config.json#L28).

Copy the [`https-redirect` middleware](sample-configs/step-3/client/server/middleware/https-redirect)
to the client's `middleware` dir:

```
cp -r sample-configs/step-3/client/server/middleware web-server/server/middleware
```

Add a [`routes:before` section to the client's `middleware.json` to register the
middleware we just copied](sample-configs/step-3/client/server/middleware.json#L22-L28).

> Notice the middleware is [configured to redirect requests to `https-port` 2101](sample-configs/step-3/client/server/middleware.json#L25).

[Add the `url` key to `config.json`](sample-configs/step-3/client/server/config.json#L27).

Start the client:

```
node client
```

Browse to [`http://localhost:3000`](http://localhost:2001) and check the URL bar
to see if you've been redirected to `https://localhost:2101`.

Shut down the server once you're done verifying the results.

####2. Render then unauthorized view for the `/` route

On the web server, create a [new view named `unauthorized.ejs`](sample-configs/phase-3/web-server/server/views/unauthorized.ejs)

Then [modify the `/` route to render this view](sample-configs/phase-3/web-server/server/boot/routes.js#L6-L8).

####3. Create a link to start the authentication flow

In the `unauthorized` view, [create a link to start OAuth 2.0 Authorization Code Grant](sample-configs/phase-3/web-server/server/views/unauthorized.ejs#L3)
flow.

####4. Retrieve the authentication code

Create a [handler to retrieve an authentication code from the API
gateway](sample-configs/phase-3/web-server/server/boot/routes.js#L10-L19).
The handler will [redirect the user to the authentication
URL](sample-configs/phase-3/web-server/server/boot/routes.js#L18)
on the API gateway to log in. Upon completion, the API gateway will
respond with the authorization code at the specified [`redirectUri`](sample-configs/phase-3/web-server/server/boot/routes.js#L13).

####5. Create a handler for the API gateway response

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

####6. Try it out

Start all three servers again and browse to [`localhost:3000`](http://localhost:3000).
Click the authentication link and respond to the questions and eventually you
will see the same page of notes again.

> Notice the user `bob` is already registered for you when going through the
authentication flow. This is because [`strong-gateway` automatically registers
this sample user](https://github.com/strongloop/strong-gateway/tree/master/server/boot/create-sample-data.js#L2-L5)
when not run in production mode (ie. NODE_ENV=prod). Also take a look at
[`sample-data.json`](https://github.com/strongloop/strong-gateway/tree/master/server/sample-data.json)
for more info.

###Step 5 - StrongLoop API Gateway policies

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


###Step 6 - Use MongoDB for the auth server's data source

####Start MongoDB

Make sure MongoDB is running on port 27017.

####Install `loopback-connector-mongodb`

Change to the auth server dir and install `loopback-connector-mongodb`:

```
cd auth-server
npm install --save loopback-connector-mongodb
cd .. # change back to the app root
```

####Configure the datasource

Update [`auth-server/server/datasources.json`](sample-configs/step-6/auth-server/server/datasources.json#L4-L10).

####Try it out

Start all three servers:

```
cd resource-server
slc start
cd ../auth-server
slc start
cd ..
node client
```

Browse to `localhost:2001`. Go through the authentication flow and you will
eventually see:

```
Notes
----
- Buy eggs
- Buy milk
- Buy sausages
```

You should see the following collections in your MongoDB database:

- OAuthAccessToken
- OAuthAuthorizationCode
- OAuthClientApplication
- OAuthPermission
- User

Check each collection for entries related to the StrongLoop API Gateway, such
as access token values, etc.

###Step 7 - Use MySQL for the auth server's data source

####Start MySQL

Make sure MySQL is running on port 3306.

####Install `loopback-connector-mysql`

Change to the auth server dir and install `loopback-connector-mysql`:

```
cd auth-server
npm install --save loopback-connector-mysql
cd .. # change back to the app root
```

####Configure the datasource

Update [`auth-server/server/datasources.json`](sample-configs/step-7/auth-server/server/datasources.json#L4-L10).

####Create the database tables

Create [`auth-server/server/scripts/setup-db.js`](sample-configs/step-7/auth-server/server/scripts/setup-db.js).

Run it to create the StrongLoop API Gateway tables:

```
node auth-server/server/scripts/setup-db.js
```

You should see the following tables in your MySQL database:

- OAuthAccessToken
- OAuthAuthorizationCode
- OAuthClientApplication
- OAuthPermission
- User

####Try it out

Start all three servers:

```
cd resource-server
slc start
cd ../auth-server
slc start
cd ..
node client
```

Browse to `localhost:2001`. Go through the authentication flow and you will
eventually see:

```
Notes
----
- Buy eggs
- Buy milk
- Buy sausages
```

Check each table for entries related to the StrongLoop API Gateway, such
as access token values, etc.

---

[Other LoopBack Examples](https://github.com/strongloop/loopback-example)
