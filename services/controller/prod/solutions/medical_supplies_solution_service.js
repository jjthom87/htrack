const {google} = require('googleapis');

const props = require('./../../../../resources/application.json');
const logger = require('./../../../../config/logging/logger.js');
const MedicalSuppliesSolution = require('./../../../../db/models/prod/MedicalSuppliesSolution.model');

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
