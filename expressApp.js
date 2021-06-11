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

//hendle form data by using multer
app.post('/test', upload.none(), (req, res) => {

    console.log({...req.body});
    res.send("Test!")
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




function createChallenge({ name, body, shortTask, answer, authorName, topics, tags }, imageName) {
    return {
        date: new Date(),
        name: name,
        body: body,
        shortTask: shortTask,
        answer: answer,
        images: imageName, //pull out file name frome the path
        difficulty: 1,
        author: authorName,
        topics: topics,
        tags: tags,
    };
}

app.post('/newchallenge', upload.single('file'), (req, res) => {

    // console.log(req.file);
    // console.log(req.body);

    const newChallenge = createChallenge(req.body, req.file ? req.file.filename : "no file");

    //check if all properties field
    for (const key in newChallenge) {
        console.log(newChallenge[key]);
        if (!newChallenge[key]) {
            res.status(500)
            res.send(key + " is empty value")
            return;
        }
    }
    try {
        console.log(newChallenge);

        const controller = new MongoController(ATLAS_URI);

        controller.run(() => {
            controller.insertDocument(newChallenge)
        });
    } catch {
        res.sendStatus(500)

    }

    res.status(200)
    res.send('Got your challenge!')
});


app.post('/parse', upload.single('file'), (req, res) => {

    console.log(req.file);
    console.log(req.body);

    // fetch('https://www5b.wolframalpha.com/input/wpg/problem.jsp?count=1&difficulty=Advanced&load=1&s=19&sessionID=MSP14051276b3h275ea686a00004i3bd5942dff83bd&type=BasicIntegrate').then(response => response.text()).then(data => console.log(data))


    https://www5b.wolframalpha.com/Calculate/MSP/MSP17271276b3h275ea686a00006ah543cbi6651b28?MSPStoreType=image/gif&s=19

    function parser() {
        const problemsArray = [];
        
        fetch('https://www5b.wolframalpha.com/input/wpg/problem.jsp?count=1&difficulty=Advanced&load=1&s=19&sessionID=MSP14051276b3h275ea686a00004i3bd5942dff85bd&type=BasicIntegrate').then(response => response.text()).then(data => console.log(data))


    }

    res.status(200)
    res.send('Got your challenge!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


