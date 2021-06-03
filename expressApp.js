const fs = require('fs');
const util = require('util');
const path = require('path');
const copyFile = util.promisify(fs.copyFile);

const bodyParser = require('body-parser')



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
        // Adding unique name to the file
        cb(null, new Date().getTime() + file.originalname);
    }
})

const upload = multer({ storage: storage });




app.use(cors())


//use instead body parser
app.use(express.json())
app.use(express.text())

//Serve files response 
app.use(express.static('images'))

app.get('/', (req, res) => {
    console.log("Hello");
    res.send('Hello World!')
})


app.post('/answer', (req, res) => {


    console.log(req.body.answer);

    const controller = new MongoController(ATLAS_URI)
    controller.run(() => {
        controller.getDocumentById(JSON.parse(req.body.id))
            .then(challenge => {
                console.log(challenge);
                if (challenge.body.answer === req.body.answer) {
                    res.send(true);
                } else {
                    res.send(false)
                }

            })
    })

})

app.post('/challenge', (req, res) => {

    console.log(req.body);
    const controller = new MongoController(ATLAS_URI)
    controller.run(() => {
        controller.getDocumentById(req.body)
            .then(challenge => {
                console.log(challenge);
                res.send(challenge)
            })
    })
})


app.post('/challenges', (req, res) => {

    console.log(req.body);
    const controller = new MongoController(ATLAS_URI)
    controller.run(() => {
        controller.getDocuments()
            .then(challenges => {
               console.log(challenges);
                res.send(challenges)
            })
    })
})




function newChallenge({ name, body, shortTask, answer, authorName, topics, tags }, imageName) {

    return {
        date: new Date(),
        name: name,
        body: body,
        shortTask: shortTask,
        answer: answer,
        images: imageName, //pull out file name frome the path
        difficulty: 2,
        author: authorName,
        topics: topics,
        tags: tags,
    };
}

app.post('/newchallenge', upload.single('image'), (req, res) => {

    // console.log(req.file);
    // console.log(req.body);

    try {
        console.log(newChallenge(req.body, req.file ? req.file.filename : "no file"));

        const controller = new MongoController(ATLAS_URI);

        controller.run(() => {
            controller.insertDocument(newChallenge(req.body, req.file ? req.file.filename : "no file"))
        });
    } catch {
        res.sendStatus(500)

    }
    
    res.status(200)
    res.send('Got your challenge!')







});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


