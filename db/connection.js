var mongoose = require('mongoose');
var morgan = require('morgan');

var props = require('./../resources/application.json');
const logger = require('./../config/logging/logger.js');

exports.createDbConnection = (app) => {
  const devDb = `mongodb://${props.db.dev.username}:${encodeURIComponent(props.db.dev.password)}@${props.db.dev.url}`;
  const prodDb = `mongodb://${props.db.prod.username}:${encodeURIComponent(props.db.prod.password)}@${props.db.prod.url}`;

  var db = process.env.APP_ENV == "dev" || process.env.APP_ENV == "local" ? devDb : prodDb;

  mongoose.connect(db, function(err,res){
    if(err){
      logger.error(`Error connecting to ${process.env.APP_ENV == "dev" || process.env.APP_ENV == "local" ? "dev" : "prod"} database: ${err}`);
    } else {
      logger.info(`Succeeded connecting to ${process.env.APP_ENV == "dev" || process.env.APP_ENV == "local" ? "dev" : "prod"} database`);
    }
  });

  app.use(morgan('combined'));
}
