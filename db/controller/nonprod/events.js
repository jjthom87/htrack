const Event = require('./../../models/nonprod/Events.model');

exports.saveNewEventsRecords = (row, records, array, cb) => {
  Event.findOne({link: row[2], name: row[3]}).exec(function(err,result){
    if (!result){
      records.newRecordsTotal++;
      records.newRecords.push(row);
      Event.create({
        modified: row[0],
        category: row[1],
        link: row[2],
        name: row[3],
        startDate: row[4],
        endDate: row[5],
        notes: row[6]
      });
    } else {
      records.duplicateRecordsTotal++;
    }
    records.saveRowsToCallback(array, cb)
  });
}

exports.getEvents = function(req, res, next) {
  Event.find({}).sort({name: 1}).exec(function(err, result) {
    if (err) {
      res.json({error: err});
    }
    res.json({result: result});
  });
}
