const IPFS = require('ipfs-api');
const Node = require('ipfs');
const express = require('express');
const fileupload = require('express-fileupload');
const ethUtil = require('ethereumjs-util');
const OrbitDB = require('orbit-db');
const NewsRoute = require('./app/news');

var app = express();
var ipfs = IPFS();

const stimulusArticlesdb = '/orbitdb/QmRffsUeGdDSms5EiqYNw69NCggegk5FutEujJ3yLT5FJd/stimulus-articles';

var node = new Node({
    repo: 'ipfs/node0',
    start: true,
    EXPERIMENTAL: {
      pubsub: true
    },
    config: {
      Addresses: {
        Swarm: [
          '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
        ]
      }
    }
  });
// var orbitdb = new OrbitDB(node);

const articlesDbName = 'stimulus-articles'
var orbitdb;
var db;

node.on('ready', async () => {
    console.log("Node ready")
    orbitdb = new OrbitDB(node);
    const access = {
        write: ['*'],
        sync: true,
    }
    db = await orbitdb.docstore(articlesDbName, access);
    await db.load();
    //     , {
    //     create: true,
    //     overwrite: true,
    //     write: ['*'],
    // });
    console.log("DB: "+db.address.toString())
    console.log("DB connected...");
});

app.use(fileupload());
app.use(express.urlencoded());
app.use('/news', NewsRoute);

app.post('/upload', (req, res) => {
    var file = req.files.upload;
    var newsTitle = req.files.title;
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
                var article = {_id: result[0].hash, title: newsTitle, author: addr, Mine: false, Published: false};
                // orbitdb.docstore(articlesDbName).then((docstore) => {
                //     docstore.put(article).then((hash) => console.log(hash));
                // });
                db.put(article).then((hash) => console.log("Article Put: "+hash));
                console.log("Written to DB");
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

function repo () {
    return 'ipfs/stimulus/' + Math.random()
}

module.exports = app;