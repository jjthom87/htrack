const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var medicalSuppliesSolutionSchema = new Schema({
	modified: {
		type: String
	},
	productCategory: {
		type: String
	},
	productName: {
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
  otherLink: {
    type: String
  },
  notes: {
    type: String
  },
  price: {
    type: String
  }
});

module.exports = mongoose.model('medicalSuppliesSolution', medicalSuppliesSolutionSchema)
