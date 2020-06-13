const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var softwareSolutionSchema = new Schema({
	modified: {
		type: String
	},
	platform: {
		type: String
	},
	solutionName: {
		type: String
	},
	developer: {
		type: String
	},
  resourceType: {
		type: String
	},
  status: {
    type: String
  },
  link: {
    type: String
  },
  otherLink: {
    type: String
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('softwareSolution', softwareSolutionSchema)
