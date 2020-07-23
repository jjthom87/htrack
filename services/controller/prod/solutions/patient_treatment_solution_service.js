const {google} = require('googleapis');

const props = require('./../../../../resources/application.json');
const logger = require('./../../../../config/logging/logger.js');
const PatientTreatmentSolution = require('./../../../../db/models/prod/PatientTreatmentSolution.model');

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
