var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var sendConfidentialTransaction = require('./blockchain.js');
var cors = require('cors')
var request = require('request');
const aztec = require('aztec.js');
const axios = require('axios');


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
    res.send('Hello World!');
});

app.post('/sendConfidentialTransaction',async function(req,res){
  var to_address=req.body.receiver;
  var value=req.body.value;
  console.log("Receiver Address = "+to_address+", value is "+value);
  var result = await sendConfidentialTransaction(value);
  console.log(result[0], result[1]);
  sendViewingKey(result[0], result[1], result[2], result[3]);
  res.end("Confidential Transfer Successful");
});

app.get('/getValFromViewingKey', async function(req, res){
  console.log("Got getValFromViewingKey request");
  var viewingKey = req.query.viewingKey;
  console.log("viewing key"+ viewingKey);
  // console.log(aztec.note.fromViewKey(viewingKey));
  var value = (await aztec.note.fromViewKey(viewingKey)).k.toNumber().toString();
  console.log(value);
  res.end(value);
  
})

function sendViewingKey(viewKey, noteHash, from, to) {
  axios.post('http://172.16.17.97:5500/reqEnc', {
    message: viewKey,
    noteHash: noteHash,
    from : from.address,
    to : to.address    
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

app.listen(3000,function(){
  console.log("Started on PORT 3000");
})