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
var cors = require('cors');
var request = require('request');
const util = require('../lib/util');

const ALICE_VERIFYING_KEY = "031b0f3a4ef7e7f9f4f9f706aa036bb6c0f63716a5e1688cc4c6d7c834ba55d596";
const POLICY_ENCRYPTING_KEY = "02701a3e23a45dc6427f422a942cb7a09200b22860cc46249f868ca4df65040bfe";

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

app.post('/retrieve', async function(req, res) {
    const bobIndex = req.body.bobIndex;
    const policyName = req.body.policyName;
    const encViewKey = req.body.encViewKey;

    const msg = await util.retreiveMessage(parseInt(bobIndex), ALICE_VERIFYING_KEY, POLICY_ENCRYPTING_KEY, policyName, encViewKey);
    res.send(msg.result.cleartexts);
});

app.listen(5500,function(){
  console.log("Started on PORT 5500");
})