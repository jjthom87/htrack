const props = require('./../../../resources/application.json');
const logger = require('./../../../config/logging/logger.js');

const sheets = require('./../../../google_sheets/google_sheets_api.js');
const dbController = require('./../../../db/controller/nonprod/publications.js');

const Records = require('./../../records.js');

exports.getAllPublications = function(req, res, next){
  dbController.getPublications(req, res, next);
}

async function saveDevPublications(rows, cb){
  const records = new Records();
  await rows.forEach(function(row, index, array){
      if(row[0] != "" && row.length > 0){
        dbController.saveNewPublicationRecords(row,records,array,cb)
      } else {
        records.blankRecordsTotal++;
        records.saveRowsToCallback(array, cb)
      }
    });
}

exports.main = async function(auth, req, res) {
  const rows = await sheets.getSheetValues(auth, props.sheets.dev.publicationSheetId, props.sheets.dev.publicationRange)
  await saveDevPublications(rows, (newRecordsTotal, newRecords) => {
    res.json({newPublicationRecordsTotal: newRecordsTotal, newPublicationRecords: newRecords});
  });
}
