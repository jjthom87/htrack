const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var devNetworkSchema = new Schema({
	modified: {
		type: String
	},
	category: {
		type: String
	},
	type: {
		type: String
	},
	name: {
		type: String
	},
  link: {
		type: String
	},
  cityState: {
    type: String
  },
  country: {
    type: String
  },
	tagOne: {
		type: String
	},
	tagTwo: {
		type: String
	}
});

module.exports = mongoose.model('devNetwork', devNetworkSchema)
