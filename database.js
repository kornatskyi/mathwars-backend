let mongoose = require('mongoose');

const ATLAS_URI = "mongodb+srv://Admin23:1323@cluster0.yhywr.mongodb.net/MathWarsChallenges?retryWrites=true&w=majority";


class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(ATLAS_URI)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}

module.exports = new Database()