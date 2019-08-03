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

const ALICE_VERIFYING_KEY = "025b24a74df391544eafd4a5fab0474dd4e77eb378cb3a8541e106e07114dfd17b";
const POLICY_ENCRYPTING_KEY = "022826b0ed39ebfcbc4759624f2959979dfc3c7affd4d2ed89d3f1535c844030b0";

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