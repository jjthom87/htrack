const {google} = require('googleapis');

const props = require('./../../../../resources/application.json');
const logger = require('./../../../../config/logging/logger.js');
const SoftwareSolution = require('./../../../../db/models/prod/SoftwareSolution.model');

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
