require('dotenv').config();

var morgan = require('morgan');
var mongoose = require('mongoose');

const aws = require('aws-sdk');
const s3 = new aws.S3();
const BUCKET = process.env.S3_BUCKET_NAME;

var fs = require('fs');
var path = require('path');
var secretsFiles = ["token.json", "application.json", "credentials.json"];
secretsFiles.forEach((file) => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    s3.getObject({
      Bucket: BUCKET,
      Key: file
    }, (err, data) => {
      if (err) console.error(err);
      fs.writeFileSync(path.join(__dirname, file), data.Body);
    });
  }
});

var PORT = process.env.PORT || 7000;

setTimeout(() => {
  const props = require('./application.json');

  const devDb = `mongodb://${props.db.dev.username}:${encodeURIComponent(props.db.dev.password)}@${props.db.dev.url}`
  const prodDb = `mongodb://${props.db.prod.username}:${encodeURIComponent(props.db.prod.password)}@${props.db.prod.url}`

  const Sheets = require('./sheets');

  var db = process.env.APP_ENV == "dev" || process.env.APP_ENV == "local" ? devDb : prodDb;

  mongoose.connect(db, function(err,res){
  	if(err){
  		logger.error(`Error connecting to ${process.env.APP_ENV} database: ${err}`);
  	} else {
  		logger.info(`Succeeded connecting to ${process.env.APP_ENV} database`);
  	}
  });

  // process.env.MONGODB_URI ||
  // process.env.MONGOHQ_URL ||
  // "mongodb://localhost:27017/humanitrack";

  const pino = require('pino');

  const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: true
  });

  var express = require('express');
  var app = express();

  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require(`./${process.env.APP_ENV}-swagger.json`);

  app.use(morgan('combined'));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // dev

  app.put('/v1/api/solution', (req,res) => {
    fs.readFile('credentials.json', (err, content) => {
      if (err){
        res.json({success: false, error: err})
      }

      // Authorize a client with credentials, then call the Google Sheets API.
      const sheetsResponse = Sheets.authorize(JSON.parse(content), Sheets.saveDevSolutions);

      res.status(200).json({success: true})
    });
  });

  app.get('/v1/api/solution', Sheets.getDevSolutions);

  // prod

  app.put('/v1/api/network', (req,res) => {
    fs.readFile('credentials.json', (err, content) => {
      if (err){
        res.json({success: false, error: err})
      }

      // Authorize a client with credentials, then call the Google Sheets API.
      const sheetsResponse = Sheets.authorize(JSON.parse(content), Sheets.saveNetwork);

      res.status(200).json({success: true})
    });
  });

  app.get('/v1/api/network', Sheets.getNetwork);

  app.put('/v1/api/network/join', Sheets.joinNetworkSolutions);

  //

  app.put('/v1/api/solutions/disease-diagnostics', (req,res) => {
    fs.readFile('credentials.json', (err, content) => {
      if (err){
        res.json({success: false, error: err})
      }

      // Authorize a client with credentials, then call the Google Sheets API.
      const sheetsResponse = Sheets.authorize(JSON.parse(content), Sheets.saveDiseaseDiagnosticsSolution);

      res.status(200).json({success: true})
    });
  });

  app.get('/v1/api/solutions/disease-diagnostics', Sheets.getDiseaseDiagnosticsSolution);

  //

  app.put('/v1/api/solutions/software', (req,res) => {
    fs.readFile('credentials.json', (err, content) => {
      if (err){
        res.json({success: false, error: err})
      }

      // Authorize a client with credentials, then call the Google Sheets API.
      const sheetsResponse = Sheets.authorize(JSON.parse(content), Sheets.saveSoftwareSolution);

      res.status(200).json({success: true})
    });
  });

  app.get('/v1/api/solutions/software', Sheets.getSoftwareSolution);

  //

  app.put('/v1/api/solutions/patient-treatment', (req, res) => {
    fs.readFile('credentials.json', (err, content) => {
      if (err){
        res.json({success: false, error: err})
      }

      // Authorize a client with credentials, then call the Google Sheets API.
      const sheetsResponse = Sheets.authorize(JSON.parse(content), Sheets.savePatientTreatmentSolution);

      res.status(200).json({success: true})
    });
  })

  app.get('/v1/api/solutions/patient-treatment', Sheets.getPatientTreatmentSolution);

  //

  app.put('/v1/api/solutions/medical-supplies', (req, res) => {
    fs.readFile('credentials.json', (err, content) => {
      if (err){
        res.json({success: false, error: err})
      }

      // Authorize a client with credentials, then call the Google Sheets API.
      const sheetsResponse = Sheets.authorize(JSON.parse(content), Sheets.saveMedicalSuppliesSolution);

      res.status(200).json({success: true})
    });
  })

  app.get('/v1/api/solutions/medical-supplies', Sheets.getVaccineSolution);

  //

  app.put('/v1/api/solutions/vaccines', (req, res) => {
    fs.readFile('credentials.json', (err, content) => {
      if (err){
        res.json({success: false, error: err})
      }

      // Authorize a client with credentials, then call the Google Sheets API.
      const sheetsResponse = Sheets.authorize(JSON.parse(content), Sheets.saveVaccineSolution);

      res.status(200).json({success: true})
    });
  });

  app.get('/v1/api/solutions/vaccines', Sheets.getMedicalSuppliesSolution);

  //

  app.listen(PORT);
}, 3000)