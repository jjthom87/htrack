const props = require('./../../../resources/application.json');
const logger = require('./../../../config/logging/logger.js');

const sheets = require('./../../../google_sheets/google_sheets_api.js');
const dbController = require('./../../../db/controller/nonprod/network.js');

const Records = require('./../../records.js');

exports.getAllNetworkRecords = function(req, res, next){
  dbController.getNetworkRecords(req, res, next);
}

async function saveDevNetworkRecords(rows, cb){
  const records = new Records();
  await rows.forEach(function(row, index, array){
      if(row[0] != "" && row.length > 0){
        dbController.saveNewNetworkRecords(row,records,array,cb)
      } else {
        records.blankRecordsTotal++;
        records.saveRowsToCallback(array, cb)
      }
    });
}

exports.main = async function(auth, req, res) {
  const rows = await sheets.getSheetValues(auth, props.sheets.dev.networkSheetId, props.sheets.dev.networkRange)
  await saveDevNetworkRecords(rows, (newRecordsTotal, newRecords) => {
    res.json({newSolutionRecordsTotal: newRecordsTotal, newSolutionRecords: newRecords});
  });
}

async function joinNetworkAndSolutionsTabs(cb){
  dbController.joinNetworkWithSolutions(cb);
}

exports.mainJoin = async function(req, res, next){
  await joinNetworkAndSolutionsTabs((newRecordsTotal, newRecords) => {
    res.json({newJoinedRecordsTotal: newRecordsTotal, newJoinedRecords: newRecords});
  });
}
