const fs = require('fs');
const util = require('util');
const path = require('path');
const copyFile = util.promisify(fs.copyFile);

const bodyParser = require('body-parser')

const {google} = require('googleapis');
function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = require('./mathwars-49dae-firebase-adminsdk-qx5hp-590c32217b.json');
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      'https://www.googleapis.com/auth/adsensehost',
      null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
getAccessToken().then(promise => console.log(promise))



/**Server exports*/
const express = require('express')
const app = express()
const cors = require('cors');
const port = 3000
const ATLAS_URI = "mongodb+srv://Admin23:1323@cluster0.yhywr.mongodb.net/MathWarsChallenges?retryWrites=true&w=majority";
//************************************************************ */



//DB exports
const mongoose = require('mongoose');
const Challenge = require('./schemas/Challenge')
//************************************************************ */



/**Create challenge function */
const createChallenge = require('./createChallenge')
//************************************************************ */



//File parser
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
//************************************************************ */



app.use(cors())


//use instead body parser
app.use(express.json())
app.use(express.text())

//Serve files response 
app.use(express.static('images'))

app.get('/', (req, res) => {
    console.log("Hello");

    res.send('Hello World!sdfgdf')
})


mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});





//hendle form data by using multer
app.post('/test', upload.none(), (req, res) => {
    console.log(req.body);
    // console.log({...req.body});
    res.send("Test complete!")
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




app.post('/newchallenge', upload.single('file'), (req, res) => {

    console.log(req.file);
    console.log(req.body);

    const newChallenge = createChallenge(req.body, req.file ? req.file.filename : "no file");

    // check if all properties field
    for (const key in newChallenge) {
        console.log(newChallenge[key]);
        if (!newChallenge[key]) {
            res.status(500)
            res.send(key + " is empty value")
            return;
        }
    }
    console.log(newChallenge);

    const challenge = new Challenge(newChallenge);

    challenge.save(function (err, challenge) {
        if (err) return console.error(err);
        console.log("Saved");
    });
    res.status(200)
    res.send('Got your challenge!')
});


//Get max n docs by filter
app.post('/10challenges', upload.none(), (req, res) => {

    console.log({ ...req.body });


    // const challenge = new Challenge({ name: 'asdf' });
    // challenge.findByName().then((chlg, err) => {
    //     if (err) console.log(err);
    //     console.log(chlg);
    // })
})



app.post('/challenges', (req, res) => {

    console.log({ ...req.body });
    const filter = { ...req.body }
    const localFilter = {};
    const sort = filter.sortBy === 'new' ? -1 : 1;
    if (filter.name) {
        const wordRegex = new RegExp(filter.name, "g");
        localFilter.body = wordRegex;
    }
    if (filter.topic) {
        const wordRegex = new RegExp(filter.topic, "g");
        localFilter.topics = wordRegex;
    }
    if (filter.lvl) {
        const wordRegex = new RegExp(filter.lvl, "g");
        localFilter.lvl = wordRegex;
    }



    //sort by newest
    Challenge.find(localFilter).sort({ date: sort }).exec(function (err, docs) {
        if (err) {
            console.log(err);
            res.send(err.message)
        }
        res.send(docs);
    });
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


module.exports = app;

