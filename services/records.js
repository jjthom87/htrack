module.exports = function Records() {
  this.newRecordsTotal = 0;
  this.duplicateRecordsTotal = 0;
  this.blankRecordsTotal = 0;
  this.newRecords = [];

  this.saveRowsToCallback = (array, cb) => {
    if ((this.newRecordsTotal + this.duplicateRecordsTotal + this.blankRecordsTotal) === array.length){
      cb(this.newRecordsTotal, this.newRecords);
    }
  }
}
