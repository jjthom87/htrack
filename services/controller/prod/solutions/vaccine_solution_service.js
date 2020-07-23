const {google} = require('googleapis');

const props = require('./../../../../resources/application.json');
const logger = require('./../../../../config/logging/logger.js');
const VaccineSolution = require('./../../../../db/models/prod/VaccineSolution.model');

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
