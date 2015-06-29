#notes-app-plain

In this tutorial, we build a client (web server) and a resource server (API
server). These two components will be used as the foundation for [part 2 of the
tutorial, `notes-app-gateway`](../notes-app-gateway).

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Run](#run)
- [Tutorial](#tutorial)

##Overview

We need to build two components: the client and the resource server. When the
client receives a request, it initiates a second request to the resource server
(via [REST](http://en.wikipedia.org/wiki/Representational_state_transfer)) to
retrieve a list of notes:

```
(Web Server)     (API Server)
 +--------+      +----------+
 | Client |----->| Resource |
 |        |<-----| Server   |
 +--------+      +----------+
```

Once the notes are retrieved, the web server displays it to the user:

```
Notes
--------------
- Buy eggs
- Buy milk
- Buy sausages
```

##Prerequisites

- Knowledge of the basics from the [LoopBack tutorial series](https://github.com/strongloop/loopback-example#tutorial-series)
- Knowledge of [StrongLoop Process Manager (PM)](http://docs.strongloop.com/display/SLC/Using+Process+Manager)
- Everything in the [setup section of the main README](https://github.com/strongloop/strong-gateway-demo#setup)

##Run

```
./start-demo
```

>PM is required to run the start-demo script.

##Tutorial

###Create the resource server

####1. Scaffold a new LoopBack application

Create a new dir to store the project components:

```
$ mkdir notes-app-plain
```

We'll refer to this dir as the *project root* from here on.

In the project root, create a new resource server:

```
cd notes-app-plain
slc loopback resource-server
... # follow the prompts
```

####2. Create the `Note` model

#####Model info

- Name: `Note`
  - Data source: `db (memory)`
  - Base class: `PersistedModel`
  - Expose over REST: `Yes`
  - Custom plural form: *Leave blank*
  - Properties:
    - `content`
      - String
      - Not required

```
cd resource-server
slc loopback:model Note
... # follow the prompts
```

####3. Create a boot script to add sample data

```
slc loopback:boot-script sample-data
... # choose `async` when prompted
```

Create the sample data as shown in [`server/boot/sample-data`](resource-server/server/boot/sample-data.js#L2-L16).

####4. Change the default port from 3000 to 3002

Change the [port in `server/config.json`](resource-server/server/config.json#L4)
from 3000 to 3002.

>We change the host port for consistency between demo projects. This means
resource servers throughout the entire tutorial always start on port 3002.

###Create the API client

####1. Scaffold a new LoopBack application

In the project root, create another project named `client`:

```
$ slc loopback client
```

####2. Configure server-side templates

Create a [`views` directory in the `server` directory](client/server/views):

```
$ cd client
$ mkdir server/views
```

Then:

- [Add the `path` module as a dependency](client/server/server.js#L3)
- [Set the view engine to `ejs`](client/server/server.js#L6)
- [Set the path to the `views` directory](client/server/server.js#L7)

>You do not need to install EJS as a dependency (ie. `npm install --save ejs`)
when using `app.set('view engine', 'ejs')` because LoopBack includes `ejs`
out-of-box.

#### 3. Set up the home page

Delete `root.js` in the [`boot` directory](web-server/server/boot) by running:

```
$ rm server/boot/root.js
```

Then create [`index.ejs`](web-server/server/views/index.ejs) in the [`views`
directory](web-server/server/views).

#### 4. Configure the `/` route

Start by installing the `request` library from NPM:

```
$ npm install --save request
```

Next, create the [`routes` boot script](web-server/server/boot/routes.js).

```
$ slc loopback:boot-script routes
$ ... # choose `sync` when prompted
```

Then in the [`routes` boot script](web-server/server/boot/routes.js):

- [Add `request` as a dependency](web-server/server/boot/routes.js#L1)
- [Handle the `/` route](web-server/server/boot/routes.js#L4-L18)

Finally, create [a view to display errors](web-server/server/views/error.ejs)
and [a view to display the notes](web-server/server/views/notes.ejs).

## Run the application

Go to the project root and start the API server by running:

```
node api-server
```

Then in a new tab, go to the project root again and start the web server by
running:

```
node web-server
```

Browse to [`localhost:3000`](http://localhost:3000) to view the notes fetched
from the API server. Notice the [three notes created in the sample-data boot
script](api-server/server/boot/sample-data.js#L6-L8) are now being rendered by
the web server.

> You can use the included [helper script to start both apps](server.js)
> instead of having to open new tabs.

That's it! [Proceed to the next tutorial](../notes-app-gateway).

---

[Other LoopBack Examples](https://github.com/strongloop/loopback-example)
