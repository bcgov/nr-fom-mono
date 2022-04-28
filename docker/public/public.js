
const express = require('express');
const helmet = require('helmet');
const path = require('path');  

const port = 4300;
const app = express();

app.disable("x-powered-by");
app.use(helmet({ 
  // Cannot use these new HTTP policies as it requires opt-in by the mapping resources (tile servers) and Keycloak, which as third parties we don't have control over.
  crossOriginResourcePolicy: false, 
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
  originAgentCluster: false,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      imgSrc: ["'self'", "https://server.arcgisonline.com data:", "https://services.arcgisonline.com data:", "https://maps.gov.bc.ca"],
      connectSrc: ["'self'", "*"],  // Add "*" if testing locally, will also need to bypass CORS in the API. 
      formAction: ["'self'"],
    },
  },
  }));

let cacheMiddleware = (req, res, next) => {
  res.set('Cache-control', 'public, max-age=300'); // allow caching for 5 minutes, for refreshing after deployments.
  next();
}
app.use(cacheMiddleware);

//Set the base path to the angular dist folder
app.use(express.static(path.join(__dirname, '.')));

//Any routes will be redirected to the angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

