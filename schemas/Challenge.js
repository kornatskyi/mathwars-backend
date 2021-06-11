const mongoose = require('mongoose');





const Challenge = new mongoose.Schema({
  date: Date,
  name: String,
  answer: String,
  authorName: String,
  topics: String,
  body: String,
  fileName: String,
  lvl: Number
});


Challenge.methods.findByName = function findByName(cb) {
  return this.model('challenges').find({ name: this.name }, cb);
};

// Challenge.methods.findAll = function findAll() {
//   return this.model('challenges').findAll({});
// };

module.exports = mongoose.model('challenges', Challenge)