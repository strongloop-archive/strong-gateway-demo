# strong-gateway-demo

## Overview

The demo scenario consists of three apps:

- demo-web-server: A web application that invokes REST APIs
- demo-api-server: A loopback application that serves the REST APIs
- strong-gateway: StrongLoop API Gateway that exposes and protects APIs

The architecture is illustrated in the diagram below.

![demo](docs/demo.png)

## Run the demo

```sh
cd demo-api-server
npm install
cd ../demo-web-server
npm install
cd ..
npm install
node .
```
