const fs = require('fs');
const util = require('util');
const path = require('path');
const copyFile = util.promisify(fs.copyFile);





const express = require('express')
const app = express()
const cors = require('cors');
const port = 3000
const ATLAS_URI = "mongodb+srv://Admin23:1323@cluster0.yhywr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const MongoController = require('./MongoController.js');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
// const upload = multer({ dest: 'images/' }); //One way to do or with more specific settings us below
const upload = multer({ storage: storage });




app.use(cors())
//Serve files response 
app.use(express.static('images'))

app.get('/', (req, res) => {
    console.log("Hello");
    res.send('Hello World!')
})

app.post('/challenge', (req, res) => {
    //Get data from request. Another way is use body parser.
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', () => {
        // console.log(JSON.parse(data));
        const controller = new MongoController(ATLAS_URI)
        controller.run(() => {
            controller.getDocumentById(JSON.parse(data))
                .then(challenge => {
                    res.send(challenge)
                })
        })
    })
})



function newChallenge({ name, body, shortTask, answer, authorName, topics, tags }, imageName) {

    const challenge = {
        id: 4,
        date: new Date(),
        name: name,
        body: {
            text: body,
            formulas: {
                formula1:
                    '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><mo>&#xA0;</mo><mo>=</mo><mo>&#xA0;</mo><mn>8</mn><mo>,</mo><mo>&#xA0;</mo><mi>b</mi><mo>&#xA0;</mo><mo>=</mo><mo>&#xA0;</mo><mn>15</mn></math>',
            },
            shortTask: shortTask,
            answerType: "number",
            answer: answer,
            images: imageName, //pull out file name frome the path
            graphs: "false",
        },
        difficulty: 2,
        author: authorName,
        topics: topics,
        tags: tags,
    };

    return challenge;
}

app.post('/newchallenge', upload.single('imageName'), (req, res) => {

    console.log(req.file.filename);
    const controller = new MongoController(ATLAS_URI);

    controller.run(() => {
        controller.insertDocument(newChallenge(req.body, req.file.filename))
    });
   
    
    // .then(controller.insertDocument(newChallenge(req.body, req.file.filename)))

    res.status(200)
    res.send()



});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


