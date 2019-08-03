// var http = require('http');
// const 

// http.createServer(function(request, response) {
//   var proxy = http.createClient(80, request.headers['host'])
//   var proxy_request = proxy.request(request.method, request.url, request.headers);
//   proxy_request.addListener('response', function (proxy_response) {
//     proxy_response.addListener('data', function(chunk) {
//       response.write(chunk, 'binary');
//     });
//     proxy_response.addListener('end', function() {
//       response.end();
//     });
//     response.writeHead(proxy_response.statusCode, proxy_response.headers);
//   });
//   request.addListener('data', function(chunk) {
//     proxy_request.write(chunk, 'binary');
//   });
//   request.addListener('end', function() {
//     proxy_request.end();
//   });
// }).listen(8080);


var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
var cors = require('cors')
const http = require("axios");
var request = require('request');

var admin = require("firebase-admin");

var serviceAccount = require("./a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://selective-zkp.firebaseio.com"
});

  var db = admin.database();
  var ref = db.ref();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
    res.send('Hello World!');
});

app.post('/reqEnc',async function(req,res){
  const message=req.body.message;
  const noteHash = req.body.noteHash;
  const from = req.body.from;
  const to = req.body.to;
  request.post({
    headers: request.headers,
    url:     'http://localhost:5000/encrypt_message',
    body:    {"message": message},
    json: true
  }, function(error, response, body){
        res.send(body.result.message_kit);
        var usersRef = ref.child("notes");
        usersRef.push({
            noteHash: noteHash,
            encMsg: body.result.message_kit,
            from,
            to
        });
    });
});

app.listen(5500,function(){
  console.log("Started on PORT 5500");
})