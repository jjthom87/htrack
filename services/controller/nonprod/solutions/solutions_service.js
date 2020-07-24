const props = require('./../../../../resources/application.json');
const logger = require('./../../../../config/logging/logger.js');

const sheets = require('./../../../../google_sheets/api/google_sheets_api.js');
const Solution = require('./../../../../db/models/nonprod/Solutions.model');
const Records = require('./../../../records.js');

function getDevSolutions(req, res){
  Solution.find({}).sort({name: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json({resultCount: result.length, result: result});
  });
}

async function saveDevSolutions(rows, cb){
  const records = new Records();
  await rows.forEach(function(row, index, array){
      if(row[0] != ""){
        Solution.findOne({solutionName: row[2]}).exec(function(err,result){
          if (!result){
            records.newRecords++;
            Solution.create({
              modified: row[0],
              technology: row[1],
              solutionName: row[2],
              developer: row[3],
              status: row[4],
              link: row[5],
              notes: row[6],
              approvals: row[7],
              price: row[8],
              speed: row[9],
              availability: row[10],
              easeOfUse: row[11],
              specificity: row[12],
              sensitivity: row[13],
              limitOfDetection: row[14],
              accuracy: row[15]
            });
          } else {
            records.duplicateRecords++;
          }
          records.saveRowsToCallback(array, cb)
        });
      } else {
        records.blankRecords++;
        records.saveRowsToCallback(array, cb)
      }
    });
}

exports.main = async function(auth, req, res) {
  const rows = await sheets.getSheetValues(auth, props.sheets.dev.solutionSheetId, props.sheets.dev.solutionRange)
  await saveDevSolutions(rows, (newRecords) => {
    res.json({newRecords: newRecords});
  });
}
