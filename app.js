const http = require('http');
const fs = require('fs');
const path = require('path');
const MongoController = require('./MongoController.js');
const { log } = require('console');

const ATLAS_URI = "mongodb+srv://Admin23:1323@cluster0.yhywr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const newConroller = new MongoController(ATLAS_URI);




http.createServer(function (request, response) {
    console.log('request ', request.url);




    if (request.method == 'POST' && request.url === "/challenge") {

        let data = '';

        request.on('data', chunk => {

            data += chunk;
        }).on('end', function () {

            // console.log(JSON.parse(data.id));

            newConroller.run(() => {
                newConroller.getDocumentById(JSON.parse(data))
                    .then(result => {
                        console.log( JSON.stringify(result) );
                        response.writeHead(200, { 'Content-Type': "text/html" });
                        response.end(JSON.stringify(result), 'utf-8');
                    })
            })

        });
        console.log(data);

        console.log();
        // request.on('end', () => {
        //     // 'Buy the milk'
        //     response.end();
        // })
        // request.on('data', function(x) { body += x; });
        // response.writeHead(200, { 'Content-Type': "text/html" });
        // response.end("hellop", 'utf-8');
        return;
    }


    let filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }




    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };



    const contentType = mimeTypes[extname] || 'application/octet-stream';




    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        }
        else {
            setTimeout(() => {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
                console.log("somthing");
            }, 1)

        }
    });

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');