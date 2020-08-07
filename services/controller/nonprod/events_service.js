const props = require('./../../../resources/application.json');
const logger = require('./../../../config/logging/logger.js');

const sheets = require('./../../../google_sheets/api/google_sheets_api.js');
const dbController = require('./../../../db/controller/nonprod/events.js');

const Records = require('./../../records.js');

async function saveDevEvents(rows, cb){
  const records = new Records();
  await rows.forEach(function(row, index, array){
      if(row[0] != ""){
        dbController.saveNewEventsRecords(row,records,array,cb)
      } else {
        records.blankRecordsTotal++;
        records.saveRowsToCallback(array, cb)
      }
    });
}

exports.main = async function(auth, req, res) {
  const rows = await sheets.getSheetValues(auth, props.sheets.dev.eventSheetId, props.sheets.dev.eventRange)
  await saveDevEvents(rows, (newRecordsTotal, newRecords) => {
    res.json({newEventRecordsTotal: newRecordsTotal, newEventRecords: newRecords});
  });
}
