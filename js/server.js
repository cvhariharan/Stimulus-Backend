const IPFS = require('ipfs-api');
const express = require('express');
const fileupload = require('express-fileupload');
const Web3 = require('web3');
const ethUtil = require('ethereumjs-util');

var app = express();
var ipfs = IPFS();
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/08cacc7bdd5144dfaed0ce1893e99021"));
console.log(web3);

app.use(fileupload());
app.use(express.urlencoded());

app.post('/upload', (req, res) => {
    var file = req.files.upload;
    var authorKey = req.body.pubkey;
    var signature = req.body.signature;
    var phrase = req.body.keyphrase;

    file.mv('uploads/'+file.name, (err) => {
        if(err) {
            console.log(err);
            return res.send(500, {error: "Sorry, the upload did not succeed."});
        }
        ipfs.util.addFromFs('./uploads/'+file.name, (err, result) => {
            if(err) {
                console.log(err);
                return res.send(500, {error: "File could not be added to the network."});
            }
            var addr = getAddressFromSig(signature, phrase);
            console.log(signature+" "+phrase+" Signed by: "+ addr);
            res.send(200, { hash: result[0].hash, author: addr});
        });
        
    })
});

function getAddressFromSig(signature, phrase) {
    const { v, r, s } = ethUtil.fromRpcSig(signature);
    var signedPubKey = ethUtil.ecrecover(Buffer.from(phrase, 'utf8'), v, r, s);
    var addrBuf = ethUtil.pubToAddress(signedPubKey);
    var addr = ethUtil.bufferToHex(addrBuf);
    return addr;
}

module.exports = app;