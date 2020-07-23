const {google} = require('googleapis');

const props = require('./../../../../resources/application.json');
const logger = require('./../../../../config/logging/logger.js');
const Solution = require('./../../../../db/models/nonprod/Solutions.model');

function getDevSolutions(req, res){
  Solution.find({}).sort({name: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json({resultCount: result.length, result: result});
  });
}

async function getDevSolutionRows(auth) {
  const sheetId = props.sheets.dev.solutionSheetId;
  const range = props.sheets.dev.solutionRange;

  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: range,
  });
  return res.data.values;
}

async function saveDevSolutions(rows, cb){
  rows.forEach(function(row, index, array){
      if(row[0] != ""){
        Solution.findOne({solutionName: row[2]}).exec(function(err,result){
          if (!result){
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
          }
          if (index === array.length - 1){
            cb();
          }
        });
      }
    });
}

exports.main = async function(auth, req, res) {
  const rows = await getDevSolutionRows(auth);
  await saveDevSolutions(rows, () => {
    getDevSolutions(req, res);
  });
}
