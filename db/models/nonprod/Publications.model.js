const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var publicationSchema = new Schema({
	modified: {
		type: String
	},
	type: {
		type: String
	},
	title: {
		type: String
	},
	author: {
		type: String
	},
  year: {
		type: String
	},
  link: {
    type: String
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('publication', publicationSchema)
