const {google} = require('googleapis');

const props = require('./../../../../resources/application.json');
const logger = require('./../../../../config/logging/logger.js');
const Network = require('./../../../../db/models/nonprod/Network.model');
const Solution = require('./../../../../db/models/nonprod/Solutions.model');

exports.saveDevNetwork = function(auth) {
  const sheetId = props.sheets.dev.networkSheetId
  const range = props.sheets.dev.networkRange

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
      Network.findOne({name: row[3]}).exec(function(err,result){
        if (!result){
          newRecords++
          Network.create({
            modified: row[0],
            category: row[1],
            type: row[2],
            name: row[3],
            link: row[4],
            cityState: row[5],
            country: row[6],
            tagOne: row[7],
            tagTwo: row[8]
          });
        }
      });
    });

    setTimeout(() => {
      logger.info("Records Added: " + newRecords)
    }, 3000)

  });
}

exports.getDevNetwork = function(req, res){
  Network.find({}).sort({name: 1}).exec(function(err, result) {
    if (err) throw err;
    res.json({resultCount: result.length, result: result});
  });
}

exports.joinNetworkSolutions = function(req, res, next){
  let newDevRecords = 0;

  Solution.aggregate([
     {
       $lookup:
         {
           from: "devNetwork",
           localField: "developer",
           foreignField: "name",
           as: "network_info"
         }
    },
    {
      $match:
      {
        "network_info":
        {
          $size: 0
        }
      }
    },
    {
      $project:
      {
        'network_info' : 0,
        "_id": 0
      }
    }
  ]).exec(function(err, result) {
     if (err) throw err;
     var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

     resultsNoDuplicates.forEach((a) => {
       newDevRecords++;
       Network.create({
         name: a.developer,
         link: a.link
       });
     })
     setTimeout(() => {
       logger.info("Solution Network Records Added: " + newDevRecords);
     }, 100)

     setTimeout(() => {
       res.json({success: true, solutionRecordsAdded: newDevRecords})
     }, 1000)
  });
}
