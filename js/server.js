const IPFS = require('ipfs-api');
const express = require('express');
const fileupload = require('express-fileupload');

var app = express();
var ipfs = IPFS();

app.use(fileupload());
app.use(express.urlencoded());

app.post('/upload', (req, res) => {
    file = req.files.upload;
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
            res.send(200, { hash: result[0].hash, author: req.body.pubkey});
        });
        
    })
});

module.exports = app;