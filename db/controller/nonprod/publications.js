const Publication = require('./../../models/nonprod/Publications.model');

exports.saveNewPublicationRecords = (row, records, array, cb) => {
  Publication.findOne({title: row[2], author: row[3]}).exec(function(err,result){
    if (!result){
      records.newRecordsTotal++;
      records.newRecords.push(row);
      Publication.create({
        modified: row[0],
        type: row[1],
        title: row[2],
        author: row[3],
        year: row[4],
        link: row[5],
        notes: row[6]
      });
    } else {
      records.duplicateRecordsTotal++;
    }
    records.saveRowsToCallback(array, cb)
  });
}

exports.getPublications = function(req, res, next) {
  Publication.find({}).sort({title: 1}).exec(function(err, result) {
    if (err) {
      res.json({error: err});
    }
    res.json({result: result});
  });
}
