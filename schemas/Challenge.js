const mongoose = require('mongoose');



const Challenge = new mongoose.Schema({
    date: Date,
    name: String,
    body: String,
    shortTask: String,
    answer: [String],
    images: String, //pull out file name frome the path
    difficulty: String,
    author: String,
    topics: String,
    tags: String,
});

Challenge.methods.findByName = function findByName (cb) {
    return this.model('challenges').find({ name: this.name }, cb);
  };

module.exports = mongoose.model('challenges', Challenge)