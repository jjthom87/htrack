const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var patientTreatmentSolutionSchema = new Schema({
	modified: {
		type: String
	},
	treatmentType: {
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
  }
});

module.exports = mongoose.model('patientTreatmentSolution', patientTreatmentSolutionSchema)
