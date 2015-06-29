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
slc loopback client
```

####2. Configure server-side templates

Create a [`views` dir in the `server` dir](client/server/views):

```
mkdir client/server/views
```

Then:

- [Add the `path` module as a dependency](client/server/server.js#L3)
- [Set the view engine to `ejs`](client/server/server.js#L6)
- [Set the path to the `views` directory](client/server/server.js#L7)

>You do not need to install EJS as a dependency (ie. `npm install --save ejs`)
when using `app.set('view engine', 'ejs')` because LoopBack includes `ejs`
out-of-box.

####3. Set up the home page

Delete `root.js` in the [`boot` dir](client/server/boot):

```
rm client/server/boot/root.js
```

Create [`index.ejs`](client/server/views/index.ejs) in the [`views` dir](client/server/views).

####4. Configure the `/` route

Add `request` as a dependency:

```
cd client
npm install --save request
```

Create the [`routes` boot script](client/server/boot/routes.js).

```
slc loopback:boot-script routes
... # choose `sync` when prompted
```

In the [`routes` boot script](client/server/boot/routes.js):

- [Add `request` as a dependency](client/server/boot/routes.js#L1)
- [Handle the `/` route](web-server/server/boot/routes.js#L4-L18)

Create [a view to display errors](client/server/views/error.ejs) and [a view to
display the notes](client/server/views/notes.ejs).

####5. Change the default port from 3000 to 2001

Change the [port in `server/config.json`](client/server/config.json#L4)
from 3000 to 2001.

>We change the host port for consistency between demo projects. This means
clients throughout the entire tutorial always start on port 2001.

##Try it out

Go to the project root and start the resource server using PM:

```
cd ../resource-server
slc start
slc ctl set-size 1 1 # optional
```

Then start the client:

```
cd ..
node client
```

Browse to `http://localhost:2001` to view the notes fetched from the API server.
Notice the [three notes created in the sample-data boot script](resource-server/server/boot/sample-data.js#L6-L8)
are now being rendered by the client. Shut down the all the servers once you've
confirmed everything is working properly.

>You can run the included [`start-demo`](start-demo) script from the project
root to automatically perform the steps above.

That concludes part 1 of the tutorial, [proceed to part 2 of the tutorial](../notes-app-gateway).

---

[Other LoopBack Examples](https://github.com/strongloop/loopback-example)
