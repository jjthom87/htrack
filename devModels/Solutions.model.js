const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var solutionSchema = new Schema({
	modified: {
		type: String
	},
	technology: {
		type: String
	},
	solutionName: {
		type: String
	},
	developer: {
		type: String
	},
  status: {
		type: String
	},
  link: {
    type: String
  },
  notes: {
    type: String
  },
	approvals: {
		type: String
	},
	price: {
		type: String
	},
	speed: {
		type: String
	},
	availability: {
		type: String
	},
	easeOfUse: {
		type: String
	},
	specificity: {
		type: String
	},
	sensitivity: {
		type: String
	},
	limitOfDetection: {
		type: String
	},
	accuracy: {
		type: String
	}
});

module.exports = mongoose.model('solution', solutionSchema)
