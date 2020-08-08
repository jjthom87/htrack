require('dotenv').config();

var express = require('express');
var app = express();

const apiConfig = require('./config/api/config.js');
const resourcesConfig = require('./config/resources/config.js');

var PORT = process.env.PORT || 7000;

apiConfig.setSwagger(app);
resourcesConfig.setResourceFiles();

setTimeout(() => {
  resourcesConfig.checkForResourceFileUpdates();

  const db = require('./db/connection.js');
  db.createDbConnection(app);

  apiConfig.setRoutes(app);

  app.listen(PORT);
}, 10000)
