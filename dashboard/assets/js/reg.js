console.log('Regulatory...');
let noteHash = "0xdf87dsds8f78adf78789";
let fromAccount = "0xdf87dsds8f78adf78789";
let to = "0xdf87dsds8f78adf78789";
let value = 0;
window.addEventListener('load', ()=>{
    document.getElementById('cardsHere').innerHTML += `<div class="card" style="background-color: #f5f5f5;box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s; margin-bottom: 20px;">
        <div class="container">
            <h5><b>From:</b> ${fromAccount}</h5>
            <h5><b>To:</b> ${to}</h5>
            <h5><b>NoteHash:</b> ${noteHash}</h5>
            <input class="btn btn-success" type="button" id="${noteHash}" onclick="viewSecretAmount(this.id)" value="View Amount" />
        </div>
    </div>`;
})

function viewSecretAmount(id){
    document.getElementById(id).insertAdjacentHTML('beforebegin', `<h5><b>Value:</b> ${value}</h5>
    `)
}