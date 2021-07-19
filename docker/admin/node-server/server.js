
const express = require('express');
const helmet = require('helmet');
const path = require('path');  

const port = 4200;
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
      frameSrc: ["'self'", "https://*.gov.bc.ca"], // gov.bc.ca is for keycloak.
      connectSrc: ["'self'", "https://*.gov.bc.ca"],  // Add "*" if testing locally, will also need to bypass CORS in the API. 
      formAction: ["'self'"],
      imgSrc: ["self", "https://server.arcgisonline.com data:", "https://services.arcgisonline.com data:", "https://maps.gov.bc.ca"]
    },
  },
  }));

let cacheMiddleware = (req, res, next) => {
  res.set('Cache-control', 'public, max-age=300'); // allow caching for 5 minutes, for refreshing after deployments.
  next();
}
app.use(cacheMiddleware);

//Set the base path to the angular-test dist folder
app.use(express.static(path.join(__dirname, 'nr-fom-admin/dist')));

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

//Any routes will be redirected to the angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'nr-fom-admin/dist/admin/index.html'));
});
