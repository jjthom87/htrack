const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var networkSchema = new Schema({
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
  location: {
    type: String
  },
  tag: {
    type: String
  }
});

module.exports = mongoose.model('network', networkSchema)
