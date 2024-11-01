# Introduction

This App represents Halloween service used by the main application located in `../web` folder.
This service is working like a micro-frontend (MFE) app and currently integrated as an `iframe` into the main 
application.

## Development 

UI part of application is built using Angular v.16. To run it in development mode
you should run `ng serve`. UI uses `api` endpoints to load images, videos and audios.
These endpoints are supported by the Express.js application. It's code you may find in 
`/server.js`. Besides Express server app serves the app in port `8081`.

## Production build

To run a production mode of the app, yoi should build the UI part first: 
```
cd ui

npm run build
```

The output code will be stored in `ui/dist` folder. Then start the server. Return to the root of the `halloween service`
and run `node server.js`. Open the served app: `htpps://localhost:8081`
