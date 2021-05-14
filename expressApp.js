const express = require('express')
const app = express()
const cors = require('cors');
const port = 3000
const ATLAS_URI = "mongodb+srv://Admin23:1323@cluster0.yhywr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const MongoController = require('./MongoController.js');

// app.use(cors())
//Serve files response 
app.use(express.static('images'))


app.get('/', (req, res) => {

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
                console.log("here");
                console.log(challenge);
                res.send(challenge)
            })
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


