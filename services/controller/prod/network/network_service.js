const {google} = require('googleapis');

const props = require('./../../../resources/application.json');
const logger = require('./../../../config/logging/logger.js');
var Network = require('./../../../db/models/prod/Network.model');

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
  Network.find({}).sort({name: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json({resultCount: result.length, result: result});
  });
}
