
if (typeof window.web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);   
}
else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
}

var keyphrase = createPhrase(32);
document.getElementById("submitBtn").addEventListener('click', (event) => {
    event.preventDefault();
});

function toHex(s) {
    var hex = '';
    for(var i=0;i<s.length;i++) { 
        hex += ''+s.charCodeAt(i).toString(16);
    }
    return `0x${hex}`;
}

function createPhrase(n) {
    var phrase = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < n; i++)
      phrase += characters.charAt(Math.floor(Math.random()*characters.length));
  
    return phrase;
}
function sign(phrase){
    //Actually submits the form after signing
    window.web3.eth.getAccounts((error, accounts) => {
            window.web3.eth.sign(phrase, accounts[0], (err, sign) => {
                if(err) {
                    throw err;
                }
                console.log(sign);
                document.getElementById("address").value = accounts[0];
                document.getElementById("sign").value = sign;
                document.getElementById("phrase").value = keyphrase;
                // var form = document.getElementById("uploadForm");
                // form.submit();
            });
    });
}

sign(toHex(keyphrase));


