console.log('Working...');
let accountAddress;
let amount;

function sendTx(){
    accountAddress = document.getElementById('accountAddress').value;    
    amount = document.getElementById('amount').value;
    //call API with accountAddress and Amount
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    var theUrl = "http://172.16.17.16:3000/sendConfidentialTransaction";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.onload = function (){
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert("Confidential Transaction Executed");
        }
    }
    xmlhttp.send(JSON.stringify({ "receiver": "0x87897m", "value": amount }));
}


