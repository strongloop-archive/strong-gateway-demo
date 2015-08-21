>**Make sure you complete [part 1 of the tutorial](../notes-app-plain) before
starting this tutorial.**

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

- Knowledge of the basics from the [LoopBack tutorial series](https://github.com/strongloop/loopback-example#tutorial-series)
- Knowledge of [StrongLoop Process Manager (PM)](http://docs.strongloop.com/display/SLC/Using+Process+Manager)
- Everything in the [setup section of the main README](https://github.com/strongloop/strong-gateway-demo#setup)
- Completion of [part 1 of the tutorial (`notes-app-plain`)](../notes-app-plain)

##Run

>Please note, we recommend running the included `install` scripts in the
>`sample-configs` dir instead of trying to manually run the steps on your own.
>The reason is `strong-pm` organizes service id's according to which apps you
>start first. Unless you are 100% sure you are starting the apps in the same
>order as the install scripts, just use the provided scripts to ensure a working
>demo.
>
>Anytime you find yourself lost or in an invalid state, please run the included
>[`clean` script](./sample-configs/clean) (ie. `./sample-configs/clean`) to
>reset the application to it's initial state. Then run any install script to
>get bring the project back to the desired step (ie. `./sample-configs/step-1/install`).

You can run any step of this tutorial by executing it's corresponding *install*
script. For example, to run step 1:

```
cd notes-app-gateway
./sample-configs/step-1/install
```

>You may see `Command "shutdown" on "http://127.0.0.1:8701" failed with Error: connect ECONNREFUSED`
if PM isn't already running. This is safe to ignore.

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

>Anytime you find yourself lost or in an invalid state, please run the included
>[`clean` script](./sample-configs/clean) (ie. `./sample-configs/clean`) to
>reset the application to it's initial state. Then run any install script to
>get bring the project back to the desired step (ie. `./sample-configs/step-1/install`).

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
```

####Try it out

Start both servers:

```
cd ../resource-server
slc start
slc ctl set-size 1 1
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
git clone -b 'v1.0.10' https://github.com/strongloop/strong-gateway auth-server
```

Install the auth server's deps:

````
cd auth-server
npm install
cd .. # change back to the app root
```

#####Change the default auth server ports

Modify the auth server's `config.json` to use ports [3001 (HTTP)](sample-configs/step-2/auth-server/server/config.json#L4)
and [3101 (HTTPS)](sample-configs/step-2/auth-server/server/config.json#L6-L7).

#####Remove unused portions of `middleware.json`

Remove [`auth`](sample-configs/step-2/auth-server/server/middleware.json#L26-27)
and [`rate-limiting-policy`](sample-configs/step-2/auth-server/server/middleware.json#L35-43)
values from the auth server's `middleware.json`.

>We will explain these values and add the sections back in a later step.

#####Change the `https-redirect` middleware port

Change the [`https-redirect` middleware port to 3101](sample-configs/step-2/auth-server/server/middleware.json#L31).

#####Verify the port changes

Start the auth server:

```
node auth-server
```

Browse to `localhost:3001`.You should be redirected to `localhost:3101` and you
should see:

```
StrongLoop API Gateway

Documentation
http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway

Demo
https://github.com/strongloop/strong-gateway-demo
```

>You may see a browser warning because we are using self-signed certificates.

Stop the server when you're done verifying the results.

####Proxy auth server requests to the resource server

Change the [proxy rule port to 3002 in `middleware.json`](sample-configs/step-2/auth-server/server/middleware.json#L39).

####Send client requests to the auth server

Change the [request URL port to 3001](sample-configs/step-2/client/server/boot/routes.js#L8)
and set the [`strictSSL` setting to `false`](sample-configs/step-2/client/server/boot/routes.js#L9)
in `client/server/boot/routes.js`.

####Try it out

Start all three servers (resource server and the auth server using PM, client
using regular node):

```
cd auth-server
slc start
slc ctl set-size 1 1
cd resource-server
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

Shut down all the servers when you're done verifying the results.

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

###Step 4 - Enable the OAuth 2.0 Authorization Code flow on the client

Since the auth server is now blocking the client from retrieving notes, we need
a way to authenticate it. To do this, We will use the [OAuth 2.0 Authorization Code Grant](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Authorizationcodegrant)
flow to authenticate client requests.

####Set up HTTPS on the client

Before authenticating with the auth server, we need to make sure we're using a
secure communication channel. To do this, we redirect users to HTTPS on the
client before making any requests to the auth server.

#####Copy the provided SSL certificates

Create a dir named `private` in `client/server`:

```
mkdir client/server/private
```

Copy the [SSL certificate files from `sample-configs/step-4/client/server/private`](sample-configs/step-3/client/server/private)
into the `private` dir.

```
cp -r sample-configs/step-4/client/server/private/ client/server/private
```

>You can create your own self-signed certificates instead of copying the
provided files.

#####Add HTTPS settings `config.json`

[Set the `url` and `https-port` port values in `config.json`](sample-configs/step-4/client/server/config.json#L27-L28).

#####Start an HTTPS server in `server.js`

[Update `server.js` to start an HTTP and HTTPS server](sample-configs/step-4/client/server/server.js#L1-L53).

#####Add HTTPS redirect middleware

Copy the [`https-redirect` middleware](sample-configs/step-4/client/server/middleware)
to the client's `middleware` dir:

```
cp -r sample-configs/step-4/client/server/middleware/ client/server/middleware
```

[Register the `https-redirect` middleware in `middleware.json`](sample-configs/step-4/client/server/middleware.json#L22-28).

#####Modify the auth server sample data value

Change the [`redirectURIs` value to `https://localhost:2101`](sample-configs/step-4/auth-server/server/sample-data.json#L14)
in `auth-server/server/sample-data.json`.

#####Try it out

Start the client:

```
node client
```

Browse to `http//localhost:2001` and check the URL bar to see if you've been
redirected to `https://localhost:2101`.

Shut down the server when you're done verifying the results.

####Render the unauthorized view for the `/` route

Create a [view named `authorize.ejs`](sample-configs/step-4/client/server/views/authorize.ejs) in `client/server/views`.

Create the [`/` route handler to render the `authorize` view](sample-configs/step-4/client/server/boot/routes.js#L6-L8).

####Retrieve the authentication code

Create the [`/authorize` route handler](sample-configs/step-4/client/server/boot/routes.js#L10-L19).

####Create a handler for the auth server response

Create the [access token helper function](sample-configs/step-4/client/server/boot/routes.js#L66-78) and the [notes helper function](sample-configs/step-4/client/server/boot/routes.js#L80-L87).

Create the [`/token` route handler](sample-configs/step-4/client/server/boot/routes.js#L21-L61).

####Try it out

[Start up all the servers](#try-it-out-1) again and browse to `localhost:2001`.
You should see:

```
Notes
-----
Click [here] to start the OAuth 2.0 Authorization Grant flow.
```

Click the "here" link. You should see:

```
Log in

Username: [bob]
Password: [••••••]
[Submit]

Hint - bob:secret
```

Notice in the URL bar, you've been redirected to `https://localhost:3202`. Log
in with the `bob:secret` credentials by clicking "Submit". You should see:

```
Request Permissions

Hi bob (foo@bar.com)!

Client application demo-app is requesting access to your account.

Permissions requested: demo

Redirect URI: https://localhost:2101/token

Do you approve?

[Allow][Deny]
```

Once you are authenticated as `bob`, the auth server asks if you want to allow
`demo-app` access to your account.

>`bob` and `demo-app` are preregistered sample data values included with the
auth server. StrongLoop API Gateway [includes this data out of the box](https://github.com/strongloop/strong-gateway/blob/master/server/boot/create-sample-data.js#L2-L5)
for demo purposes.

Click "Allow" to approve the permission request. You should see:

```
Notes
--------------
- Buy eggs
- Buy milk
- Buy sausages
```

That's it. Shutdown the servers when you're done.

For more information on whats happening behind the scenes, see the [official documentation for this particular flow](http://docs.strongloop.com/display/LGW/Developer%27s+Guide#Developer'sGuide-Authorizationcodegrant).

###Step 5 - StrongLoop API Gateway policies

In addition to the basic gateway features, the StrongLoop API gateway also
provides set of features known as [*policies*](http://docs.strongloop.com/display/LGW/StrongLoop+API+Gateway#StrongLoopAPIGateway-Policies).

####Rate limiting

[*Rate limiting*](http://docs.strongloop.com/display/LGW/Configuring+policies#Configuringpolicies-Configuringratelimiting) is used to control the number of API calls from clients within a certain period of time.

#####Configure the `rate-limiting-policy` middleware

Configure the [`rate-limiting-policy` middleware in the auth server's
`middleware.json`](sample-configs/step-5/auth-server/server/middleware.json#L57-L83).

#####Create the `rate-limiting-client` script

Create the [`rate-limiting` script](sample-configs/step-5/client/server/scripts/rate-limiting.js)
in `client/server/scripts`.

>The script sends a large number of requests to the auth server and logs each
response header to the console.

#####Try it out

Start the auth server:

```
node auth-server
```

Run the `rate-limiting` script:

```
node client/server/scripts/rate-limiting.js
```

You should see:

```
Access Token: ... # your access token value
Key: url-api/notes - Limit: 1000 - Remaining: 999 - Reset: 60000
Key: url-api/notes - Limit: 1000 - Remaining: 998 - Reset: 60000
Key: url-api/notes - Limit: 1000 - Remaining: 997 - Reset: 60000
Key: url-api/notes - Limit: 1000 - Remaining: 996 - Reset: 59999
Key: url-api/notes - Limit: 1000 - Remaining: 995 - Reset: 59999
Key: url-api/notes - Limit: 1000 - Remaining: 994 - Reset: 59941
...
```

Notice the headers show the maximum number of requests (1000), the number of
remaining requests (999, 998, ...) and the time left (in ms) until that count
resets (60000, 59982, ...). See the [official docs](http://docs.strongloop.com/display/LGW/Configuring+policies#Configuringpolicies-Configuringratelimiting)
for more info.

####API Analytics

The StrongLoop API Gateway can gather analytics related to API usage. We will be
using [StrongLoop Arc (Arc)](https://strongloop.com/node-js/arc/) to view the
collected data.

#####Start the auth server

Start the auth server using PM:

```
cd auth-server
slc start
```

Start Arc:

```
slc arc
```

At this point, `strong-arc` will automatically open your browser.

Go to the "API Analytics" module and enter the following info:

- Hostname: `localhost`
- Port: `8701`

#####Load the analytics screen

Click the "Load" button on the left side of the screen to load the graphs.

>The graph does not update automatically, you will need to click the "Load"
button to refresh the data. This will be addressed in a future update.

#####Perform API requests

To create analytics to gather, we'll reuse the [`rate-limiting` script from the
previous section](sample-configs/step-5/client/server/scripts/rate-limiting.js):

```
node client/server/scripts/rate-limiting.js
```

This script will make a large number of requests and cause changes to the
analytics graph data.

######Verify the graph changes

Go back to the Arc window and view the analytics again. Click "Load" again to
refresh the data. You should many changes that correspond with the activity
caused by the rate limiting script.

>See ["API Analytics"](http://docs.strongloop.com/display/SLC/API+Analytics).

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
cd auth-server
slc start
cd ../resource-server
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
cd auth-server
slc start
cd ../resource-server
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
