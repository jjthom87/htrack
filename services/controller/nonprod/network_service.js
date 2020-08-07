const props = require('./../../../resources/application.json');
const logger = require('./../../../config/logging/logger.js');

const sheets = require('./../../../google_sheets/api/google_sheets_api.js');
const dbController = require('./../../../db/controller/nonprod/network.js');

const Records = require('./../../records.js');

async function saveDevNetworkRecords(rows, cb){
  const records = new Records();
  await rows.forEach(function(row, index, array){
      if(row[0] != ""){
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

exports.getDevNetwork = function(req, res){
  Network.find({}).sort({name: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json({resultCount: result.length, result: result});
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
