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
const ports = require('../ports.json');

// const ALICE_VERIFYING_KEY = "03bc0b374036e0e08c6bef51a195eb2e6f5b267e85b0e090af3022ed2a2ba4ebeb";
// const POLICY_ENCRYPTING_KEY = "03f451f5a4312b0b9978760a5b3bbac0691c3e2fa3d854234a75e36dccf525f99d";
// const BOB_VERIFYING_KEYS = ["02eff5e5351370f84d421fb4904e59f16852fb4bf9f5f6b62424f091633fdba438", "03efd672f5e865c41cf3e4ca46e0b184ca143b2f472c3e976609317c0262964fb7"];
// const BOB_ENCRYPTING_KEYS = ["03bd0fbd36c6b0b593faef04f92c8e69798e3a64c1de18520908cba6fad7a860b8", "02e2c5913afc88cc7b35cd6e9d6f864f231f4bd4f9d5286145c280780d2f2fcf3d"]
const ALICE_VERIFYING_KEY = ports["Alice"][0].verification_key;
const POLICY_ENCRYPTING_KEY = ports.policy_encrypting_key;
const BOB_VERIFYING_KEYS = [], BOB_ENCRYPTING_KEYS = [];

for(let i in ports["Bob"]) {
    BOB_ENCRYPTING_KEYS.push(ports["Bob"][i].encryption_key)
    BOB_VERIFYING_KEYS.push(ports["Bob"][i].verification_key)
}

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
  const label = req.body.label;
  request.post({
    headers: request.headers,
    url:     'http://localhost:5000/encrypt_message',
    body:    {"message": message},
    json: true
  }, function(error, response, body){
        res.send(body.result.message_kit);
        console.log(label);
        if(label){
          var usersRef = ref.child(`notes/${label}`);
        usersRef.set({
            noteHash: noteHash,
            encMsg: body.result.message_kit,
            from,
            to
        });
        }else{
          var usersRef = ref.child("notes");
          usersRef.push({
              noteHash: noteHash,
              encMsg: body.result.message_kit,
              from,
              to
          });
        }
        
    });
});

app.post('/retrieve', async function(req, res) {
    const bobIndex = req.body.bobIndex;
    const policyName = req.body.policyName;
    const encViewKey = req.body.encViewKey;

    const msg = await util.retreiveMessage(parseInt(bobIndex), ALICE_VERIFYING_KEY, POLICY_ENCRYPTING_KEY, policyName, encViewKey);
    res.send(msg.result.cleartexts);
});

app.post('/grant', async (req, res) => {
    // bob_encrypting_key, bob_verifying_key, policyName, m, n, expiry
    const bobIndex = req.body.bobIndex;
    const bob_encrypting_key = BOB_ENCRYPTING_KEYS[bobIndex];
    const policyName = req.body.policyName;
    // TODO - as this is a dev network, we only have one ursula
    const m = 1, n = 1;
    // TODO - to be sent by granter
    const expiry = "2020-09-15T15:20:00";

    const msg = await util.grantAccess(bob_encrypting_key, BOB_VERIFYING_KEYS[bobIndex], policyName, m, n, expiry);
    console.log(msg);
    res.send(true);
});

app.post('/revoke', async (req, res) => {
  console.log(req.body)
    const bobIndex = req.body.bobIndex;
    const policyName = req.body.policyName;

    const msg = await util.revokeAccess(BOB_VERIFYING_KEYS[bobIndex], policyName);
    console.log(msg);
    res.send(msg.result);
});

app.listen(5500,function(){
  console.log("Started on PORT 5500");
})