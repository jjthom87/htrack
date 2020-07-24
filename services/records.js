module.exports = function Records() {
  this.newRecords = 0;
  this.duplicateRecords = 0;
  this.blankRecords = 0;

  this.saveRowsToCallback = (array, cb) => {
    if ((this.newRecords + this.duplicateRecords + this.blankRecords) === array.length){
      cb(this.newRecords);
    }
  }
}
