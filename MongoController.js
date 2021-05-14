const { MongoClient } = require("mongodb");
class MongoController {

    constructor(uri) {
        this.uri = uri;
        this.client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    async run(callBack) {
        try {
            await this.client.connect();
            await callBack()
        } finally {

        }
    }

    async getDocumentById(id) {
        const database = this.client.db('MathWarsChalleges');
        const challenges = database.collection('Challenges');
        let cursor = {};

        try {
            console.log(id);
            cursor = await challenges.findOne(id);
            
        
        } finally {
            this.client.close()
            return cursor;
        }
    }
}



module.exports = MongoController;


