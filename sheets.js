const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const props = require('./application.json')

const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: true
});

//dev
var Solution = require('./devModels/Solutions.model');
var DevNetwork = require('./devModels/Network.model');

//prod
var Network = require('./models/Network.model');
var DiseaseDiagnosticsSolution = require('./models/DiseaseDiagnosticsSolution.model');
var SoftwareSolution = require('./models/SoftwareSolution.model');
var PatientTreatmentSolution = require('./models/PatientTreatmentSolution.model');
var MedicalSuppliesSolution = require('./models/MedicalSuppliesSolution.model');
var VaccineSolution = require('./models/VaccineSolution.model')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
exports.authorize = function(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  logger.info('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

//dev

exports.saveDevSolutions = function(auth) {
  const sheetId = props.sheets.dev.solutionSheetId
  const range = props.sheets.dev.solutionRange

  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: range,
  }, (err, res) => {
    if (err){
      logger.error("error: " + err)
    }
    const rows = res.data.values;

    let newRecords = 0;

    rows.forEach(function(row){
      if(row[0] != ""){
        Solution.findOne({solutionName: row[2]}).exec(function(err,result){
          if (!result){
            newRecords++
            Solution.create({
              modified: row[0],
              technology: row[1],
              solutionName: row[2],
              developer: row[3],
              status: row[4],
              link: row[5],
              notes: row[6],
              approvals: row[7],
              price: row[8],
              speed: row[9],
              availability: row[10],
              easeOfUse: row[11],
              specificity: row[12],
              sensitivity: row[13],
              limitOfDetection: row[14],
              accuracy: row[15]
            });
          }
        });
      }
    });

    setTimeout(() => {
      logger.info("Records Added: " + newRecords)
    }, 3000)

  });
}

exports.getDevSolutions = function(req, res, next){
  Solution.find({}).sort({name: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json({resultCount: result.length, result: result});
  });
}

//

exports.saveDevNetwork = function(auth) {
  const sheetId = props.sheets.dev.networkSheetId
  const range = props.sheets.dev.networkRange

  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: range,
  }, (err, res) => {
    if (err){
      logger.error("error: " + err)
    }
    const rows = res.data.values;

    let newRecords = 0;

    rows.forEach(function(row){
      DevNetwork.findOne({name: row[3]}).exec(function(err,result){
        if (!result){
          newRecords++
          DevNetwork.create({
            modified: row[0],
            category: row[1],
            type: row[2],
            name: row[3],
            link: row[4],
            cityState: row[5],
            country: row[6],
            tagOne: row[7],
            tagTwo: row[8]
          });
        }
      });
    });

    setTimeout(() => {
      logger.info("Records Added: " + newRecords)
    }, 3000)

  });
}

//prod

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
exports.saveNetwork = function(auth) {
  const sheetId = props.sheets.prod.networkSheetId
  const range = props.sheets.prod.networkRange

  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: range,
  }, (err, res) => {
    if (err){
      logger.error("error: " + err)
    }
    const rows = res.data.values;

    let newRecords = 0;

    rows.forEach(function(row){
      rowNum++;
      Network.findOne({name: row[3]}).exec(function(err,result){
        if (!result){
          newRecords++
          Network.create({
            modified: row[0],
            category: row[1],
            type: row[2],
            name: row[3],
            link: row[4]
          });
        }
      });
    });

    setTimeout(() => {
      logger.info("Records Added: " + newRecords)
    }, 3000)

  });
}

exports.getNetwork = function(req, res, next){
  if(process.env.APP_ENV == "prod"){
    Network.find({}).sort({name: 1}).exec(function(err, result) {
      if (err) throw err;
      res.json({resultCount: result.length, result: result});
    });
  } else {
    DevNetwork.find({}).sort({name: 1}).exec(function(err, result) {
      if (err) throw err;
      res.json({resultCount: result.length, result: result});
    });
  }
}

//

exports.saveDiseaseDiagnosticsSolution = function(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: props.sheets.solutionSheetId,
    range: 'Disease diagnostics!A3:R',
  }, (err, res) => {
    if (err){
      logger.error(err)
    }
    const rows = res.data.values;

    let newRecords = 0;

    rows.forEach(function(row){
      DiseaseDiagnosticsSolution.findOne({developer: row[3]}).exec(function(err,result){
        if (!result){
          newRecords++
          DiseaseDiagnosticsSolution.create({
      			modified: row[0],
      			technology: row[1],
      			solutionName: row[2],
      			developer: row[3],
            status: row[4],
            link: row[5],
            otherLink: row[6],
            notes: row[7],
            approvals: row[8],
            price: row[9],
            speed: row[10],
            averageSpeed: row[11],
            availability: row[12],
            easeOfUse: row[13],
            specificity: row[14],
            sensitivity: row[15],
            limitOfDetection: row[16],
            accuracy: row[17]
      		});
        }
      });
  	});

    setTimeout(() => {
      logger.info("Records Added: " + newRecords);
    }, 3000)

  });
}

exports.getDiseaseDiagnosticsSolution = function(req, res, next){
  DiseaseDiagnosticsSolution.find({}).sort({developer: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json(result);
  });
}

//

exports.saveSoftwareSolution = function(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: props.sheets.solutionSheetId,
    range: 'Software!A3:R',
  }, (err, res) => {
    if (err){
      logger.error(err)
    }
    const rows = res.data.values;

    let newRecords = 0;

    rows.forEach(function(row){
      SoftwareSolution.findOne({developer: row[3]}).exec(function(err,result){
        if (!result){
          newRecords++
          SoftwareSolution.create({
      			modified: row[0],
      			platform: row[1],
      			solutionName: row[2],
      			developer: row[3],
            resourceType: row[4],
            status: row[5],
            link: row[6],
            otherLink: row[7],
            notes: row[8]
      		});
        }
      });
  	});

    setTimeout(() => {
      logger.info("Records Added: " + newRecords);
    }, 3000)

  });
}

exports.getSoftwareSolution = function(req, res, next){
  SoftwareSolution.find({}).sort({developer: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json(result);
  });
}

//

exports.savePatientTreatmentSolution = function(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: props.sheets.solutionSheetId,
    range: 'Patient treatment!A3:H',
  }, (err, res) => {
    if (err){
      logger.error(err)
    }
    const rows = res.data.values;

    let newRecords = 0;

    rows.forEach(function(row){
      PatientTreatmentSolution.findOne({developer: row[3]}).exec(function(err,result){
        if (!result){
          newRecords++
          PatientTreatmentSolution.create({
      			modified: row[0],
      			treatmentType: row[1],
      			solutionName: row[2],
      			developer: row[3],
            status: row[4],
            link: row[5],
            notes: row[7]
      		});
        }
      });
  	});

    setTimeout(() => {
      logger.info("Records Added: " + newRecords);
    }, 3000)

  });
}

exports.getPatientTreatmentSolution = function(req, res, next){
  PatientTreatmentSolution.find({}).sort({developer: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json(result);
  });
}

//

exports.saveMedicalSuppliesSolution = function(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: props.sheets.solutionSheetId,
    range: 'Medical supplies!A3:I',
  }, (err, res) => {
    if (err){
      logger.error(err)
    }
    const rows = res.data.values;

    let newRecords = 0;

    rows.forEach(function(row){
      MedicalSuppliesSolution.findOne({developer: row[3]}).exec(function(err,result){
        if (!result){
          newRecords++
          MedicalSuppliesSolution.create({
      			modified: row[0],
      			productCategory: row[1],
      			productName: row[2],
      			developer: row[3],
            status: row[4],
            link: row[5],
            otherLink: row[6],
            notes: row[7],
            price: row[8]
      		});
        }
      });
  	});

    setTimeout(() => {
      logger.info("Records Added: " + newRecords);
    }, 3000)

  });
}

exports.getMedicalSuppliesSolution = function(req, res, next){
  MedicalSuppliesSolution.find({}).sort({developer: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json(result);
  });
}

//

exports.saveVaccineSolution = function(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: props.sheets.solutionSheetId,
    range: 'Vaccines!A3:P',
  }, (err, res) => {
    if (err){
      logger.error(err)
    }
    const rows = res.data.values;

    let newRecords = 0;

    rows.forEach(function(row){
      VaccineSolution.findOne({developer: row[3]}).exec(function(err,result){
        if (!result){
          newRecords++
          VaccineSolution.create({
      			modified: row[0],
      			type: row[1],
      			vaccineName: row[2],
            developer: row[3],
      			otherEntitiesWorkingOn: row[4],
            statusHumanCt: row[5],
            trialLocation: row[6],
            link: row[7],
            otherLink: row[8],
            notes: row[9],
            resultsSummary: row[10],
            ctStatus: row[11],
            phaseStartDate: row[12],
            phaseEndDate: row[13],
            ctTestsSafetyOutcome: row[14],
            ctTestsImmunityOutcome: row[15]
      		});
        }
      });
  	});

    setTimeout(() => {
      logger.info("Records Added: " + newRecords);
    }, 3000)

  });
}

exports.getVaccineSolution = function(req, res, next){
  VaccineSolution.find({}).sort({developer: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json(result);
  });
}

//

exports.joinNetworkSolutions = function(req, res, next){
  if(process.env.APP_ENV == "dev" || process.env.APP_ENV == "local"){
    let newDevRecords = 0;

    Solution.aggregate([
       {
         $lookup:
           {
             from: "devNetwork",
             localField: "developer",
             foreignField: "name",
             as: "network_info"
           }
      },
      {
        $match:
        {
          "network_info":
          {
            $size: 0
          }
        }
      },
      {
        $project:
        {
          'network_info' : 0,
          "_id": 0
        }
      }
    ]).exec(function(err, result) {
       if (err) throw err;
       var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

       resultsNoDuplicates.forEach((a) => {
         newDevRecords++;
         DevNetwork.create({
           name: a.developer,
           link: a.link
         });
       })
       setTimeout(() => {
         logger.info("Solution Network Records Added: " + newDevRecords);
       }, 100)

       setTimeout(() => {
         res.json({success: true, solutionRecordsAdded: newDevRecords})
       }, 1000)
    });
  } else {
    var totalResults = [];
    let newDDRecords = 0;
    let newSRecords = 0;
    let newPTRecords = 0;
    let newMSRecords = 0;
    let newVRecords = 0;

    DiseaseDiagnosticsSolution.aggregate([
       {
         $lookup:
           {
             from: "networks",
             localField: "developer",
             foreignField: "name",
             as: "network_info"
           }
      },
      {
        $match:
        {
          "network_info":
          {
            $size: 0
          }
        }
      },
      {
        $project:
        {
          'network_info' : 0,
          "_id": 0
        }
      }
    ]).exec(function(err, result) {
       if (err) throw err;
       var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

       resultsNoDuplicates.forEach((a) => {
         newDDRecords++;
         Network.create({
           name: a.developer,
           link: a.link
         });
         totalResults.push(a)
       })
       setTimeout(() => {
         logger.info("Disease Diagnostics Records Added: " + newDDRecords);
       }, 100)
    });

    SoftwareSolution.aggregate([
       {
         $lookup:
           {
             from: "networks",
             localField: "developer",
             foreignField: "name",
             as: "network_info"
           }
      },
      {
        $match:
        {
          "network_info":
          {
            $size: 0
          }
        }
      },
      {
        $project:
        {
          'network_info' : 0,
          "_id": 0
        }
      }
    ]).exec(function(err, result) {
       if (err) throw err;
       var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

       resultsNoDuplicates.forEach((a) => {
         newSRecords++;
         Network.create({
           name: a.developer,
           link: a.link
         });
         totalResults.push(a)
       })
       setTimeout(() => {
         logger.info("Software Records Added: " + newSRecords);
       }, 100)
    });

    PatientTreatmentSolution.aggregate([
       {
         $lookup:
           {
             from: "networks",
             localField: "developer",
             foreignField: "name",
             as: "network_info"
           }
      },
      {
        $match:
        {
          "network_info":
          {
            $size: 0
          }
        }
      },
      {
        $project:
        {
          'network_info' : 0,
          "_id": 0
        }
      }
    ]).exec(function(err, result) {
       if (err) throw err;
       var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

       resultsNoDuplicates.forEach((a) => {
         newPTRecords++;
         Network.create({
           name: a.developer,
           link: a.link
         });
         totalResults.push(a)
       })
       setTimeout(() => {
         logger.info("Patient Treatment Solution Records Added: " + newPTRecords);
       }, 100)
    });

    MedicalSuppliesSolution.aggregate([
       {
         $lookup:
           {
             from: "networks",
             localField: "developer",
             foreignField: "name",
             as: "network_info"
           }
      },
      {
        $match:
        {
          "network_info":
          {
            $size: 0
          }
        }
      },
      {
        $project:
        {
          'network_info' : 0,
          "_id": 0
        }
      }
    ]).exec(function(err, result) {
       if (err) throw err;
       var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

       resultsNoDuplicates.forEach((a) => {
         newMSRecords++;
         Network.create({
           name: a.developer,
           link: a.link
         });
         totalResults.push(a)
       })
       setTimeout(() => {
         logger.info("Medical Supplies Solution Records Added: " + newMSRecords);
       }, 100)
    });

    VaccineSolution.aggregate([
       {
         $lookup:
           {
             from: "networks",
             localField: "developer",
             foreignField: "name",
             as: "network_info"
           }
      },
      {
        $match:
        {
          "network_info":
          {
            $size: 0
          }
        }
      },
      {
        $project:
        {
          'network_info' : 0,
          "_id": 0
        }
      }
    ]).exec(function(err, result) {
       if (err) throw err;
       var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

       resultsNoDuplicates.forEach((a) => {
         newVRecords++;
         Network.create({
           name: a.developer,
           link: a.link
         });
         totalResults.push(a)
       })
       setTimeout(() => {
         logger.info("Vaccine Solution Records Added: " + newVRecords);
       }, 100)
    });

    setTimeout(() => {
      res.json({success: true, softwareRecords: newSRecords, diseaseDiagnosticRecords: newDDRecords, patientTreatmentRecords: newPTRecords, medicalSuppliesRecords: newMSRecords, vaccineRecords: newVRecords})
    }, 1000)
  }
}
