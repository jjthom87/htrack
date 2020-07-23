const {google} = require('googleapis');

const props = require('./../../../../resources/application.json');
const logger = require('./../../../../config/logging/logger.js');
const DiseaseDiagnosticsSolution = require('./../../../../db/models/prod/DiseaseDiagnosticsSolution.model');

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
