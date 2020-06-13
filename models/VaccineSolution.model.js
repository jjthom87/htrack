const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var vaccineSolutionSchema = new Schema({
	modified: {
		type: String
	},
	type: {
		type: String
	},
	vaccineName: {
		type: String
	},
	developer: {
		type: String
	},
  otherEntitiesWorkingOn: {
		type: String
	},
  statusHumanCt: {
    type: String
  },
  trialLocation: {
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
  },
  resultsSummary: {
    type: String
  },
  ctStatus: {
    type: String
  },
  phaseStartDate: {
    type: String
  },
  phaseEndDate: {
    type: String
  },
  ctTestsSafetyOutcome: {
    type: String
  },
  ctTestsImmunityOutcome: {
    type: String
  }
});

module.exports = mongoose.model('vaccineSolution', vaccineSolutionSchema)
