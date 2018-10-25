const IPFS = require('ipfs-api');
const express = require('express');
const fileupload = require('express-fileupload');
const ethUtil = require('ethereumjs-util');
const OrbitDB = require('orbit-db');


var app = express();
var ipfs = IPFS();
var orbitdb = new OrbitDB(ipfs);

const articlesDbName = 'stimulus-articles'

app.use(fileupload());
app.use(express.urlencoded());

app.post('/upload', (req, res) => {
    var file = req.files.upload;
    var title = req.files.title;
    // var authorKey = req.body.pubkey;
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
            try {
                var addr = getAddressFromSig(signature, phrase);
                console.log(signature+" "+phrase+" Signed by: "+ addr);
                var article = {_id: result[0].hash, title: title, author: addr, Mine: false, Published: false};
                orbitdb.docstore(articlesDbName).then((docstore) => {
                    docstore.put(article).then((hash) => console.log(hash));
                });
                res.send(200, { hash: result[0].hash, author: addr});
            } catch(err) {
                console.log(err);
                res.send(500, err.toString());
            }
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