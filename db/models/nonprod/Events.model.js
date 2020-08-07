const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var devEventsSchema = new Schema({
	modified: {
		type: String
	},
	category: {
		type: String
	},
	link: {
		type: String
	},
	name: {
		type: String
	},
  startDate: {
		type: String
	},
  endDate: {
    type: String
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('devEvents', devEventsSchema);
