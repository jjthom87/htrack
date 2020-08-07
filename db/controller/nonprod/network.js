const Network = require('./../../models/nonprod/Network.model');
const Solution = require('./../../models/nonprod/Solutions.model');

const Records = require('./../../../services/records.js');

exports.saveNewNetworkRecords = (row, records, array, cb) => {
  Network.findOne({name: row[3], link: row[4]}).exec(function(err,result){
    if (!result){
      records.newRecordsTotal++;
      records.newRecords.push(row);
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
    } else {
      records.duplicateRecordsTotal++;
    }
    records.saveRowsToCallback(array, cb)
  });
}

exports.getNetworkRecords = async function() {
  return new Promise(function(resolve, reject) {
    Network.find({}).sort({name: 1}).exec(function(err, result) {
      if (err) {
        return reject(err)
      }
      return resolve(result);
    });
  });
}

exports.joinNetworkWithSolutions = (cb) => {
  const records = new Records();

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

     resultsNoDuplicates.forEach((record, index, array) => {
       Network.findOne({name: record.developer}).exec(function(err,result){
           if (!result){
             records.newRecordsTotal++;
             records.newRecords.push(record);
             Network.create({
               name: record.developer,
               link: record.link
             });
           } else {
             records.duplicateRecordsTotal++;
           }
           records.saveRowsToCallback(array, cb)
         });
       });
   });

}
