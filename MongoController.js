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


// const database = client.db('MathWarsChalleges');
// const challenges = database.collection('Challenges');
// // Query for a movie that has the title 'Back to the Future'
// const challenge = {
//     "id": 1,
//     "date": "03/31/2021",
//     "name": "Find a length of the hypotenuse",
//     "body": {
//         "text": "Find the length of the unknown side of the right triangle. In each case, a and b represent the lengths of the legs and c represents the length of the hypotenuse.",
//         "formulas": {
//             "formula1": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>a</mi><mo>&#xA0;</mo><mo>=</mo><mo>&#xA0;</mo><mn>8</mn><mo>,</mo><mo>&#xA0;</mo><mi>b</mi><mo>&#xA0;</mo><mo>=</mo><mo>&#xA0;</mo><mn>15</mn></math>"
//         },
//         "shortTask": "find c",
//         "answerType": "number",
//         "answer": "17",
//         "images": "../data/challenge1/triangle.png",
//         "graphs": "false"
//     },
//     "difficulty": 2,
//     "author": "Author Name",
//     "topics": {
//         "0": "algebra",
//         "1": "Calculus"
//     },
//     "tags": {
//         "0": "geometry",
//         "1": "school"
//     }
// };



// await challenges.insertOne(challenge);

// run();