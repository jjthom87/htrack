const Solution = require('./../../models/nonprod/Solutions.model');

exports.saveNewSolutionsRecords = (row, records, array, cb) => {
  Solution.findOne({solutionName: row[2], developer: row[3]}).exec(function(err,result){
    if (!result){
      records.newRecordsTotal++;
      records.newRecords.push(row);
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
      records.duplicateRecordsTotal++;
    }
    records.saveRowsToCallback(array, cb)
  });
}

exports.getSolutions = function(req, res, next) {
  Solution.find({}).sort({solutionName: 1}).exec(function(err, result) {
    if (err) {
      res.json({error: err});
    }
    res.json({result: result});
  });
}
