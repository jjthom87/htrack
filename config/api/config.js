var morgan = require('morgan');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require(`./${process.env.APP_ENV == "local" ? "dev" : process.env.APP_ENV}-swagger.json`);

exports.setSwagger = (app) => {
  if(process.env.APP_ENV == "local"){
    swaggerDocument.host = "localhost:7000"
    swaggerDocument.schemes[0] = "http"
  } else if (process.env.APP_ENV == "dev"){
    swaggerDocument.host = "stark-forest-67206.herokuapp.com"
    swaggerDocument.schemes[0] = "https"
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

exports.setRoutes = (app) => {
  if(process.env.APP_ENV == "dev" || process.env.APP_ENV == "local"){
    fs.readdirSync(path.join(__dirname, `/../../services/router/nonprod`)).forEach((file) => {
      app.use('/v1', require(path.join(__dirname, `/../../services/router/nonprod/${file}`)));
    })
  } else {
    fs.readdirSync(path.join(__dirname, `/../../services/router/prod`)).forEach((file) => {
      app.use('/v1', require(path.join(__dirname, `/../../services/router/prod/${file}`)));
    })
  }
}
