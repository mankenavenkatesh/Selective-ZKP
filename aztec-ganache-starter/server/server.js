var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
var sendConfidentialTransaction = require('./blockchain.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
    res.send('Hello World!');
});

app.post('/sendConfidentialTransaction',async function(req,res){
  var to_address=req.body.receiver;
  var value=req.body.value;
  console.log("Receiver Address = "+to_address+", value is "+value);
  var viewKey = await sendConfidentialTransaction(value);
  console.log(viewKey);
  res.end("Confidential Transfer Successful");
});

app.listen(3000,function(){
  console.log("Started on PORT 3000");
})