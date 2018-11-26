const IPFS = require('ipfs-api');
const Node = require('ipfs');
const express = require('express');
const fileupload = require('express-fileupload');
const ethUtil = require('ethereumjs-util');
const OrbitDB = require('orbit-db');
const Util = require('./util.js');
var Web3 = require('web3');

const web3Events = new Web3();
web3Events.setProvider('wss://ropsten.infura.io/ws');
const contractABI = [{"inputs":[{"name":"tokenAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ipfsHash","type":"string"}],"name":"VotingEnded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ipfsHash","type":"string"},{"indexed":false,"name":"voter","type":"address"}],"name":"Voted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ipfsHash","type":"string"},{"indexed":false,"name":"accepted","type":"bool"}],"name":"Accepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"author","type":"address"},{"indexed":false,"name":"reputation","type":"uint256"}],"name":"ReputationUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ipfsHash","type":"string"},{"indexed":false,"name":"author","type":"address"}],"name":"ArticleAdded","type":"event"},{"constant":false,"inputs":[{"name":"ipfsHash","type":"string"},{"name":"duration","type":"uint256"}],"name":"addArticle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ipfsHash","type":"string"},{"name":"castVote","type":"bool"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"ipfsHash","type":"string"}],"name":"getVotes","outputs":[{"name":"yays","type":"uint256"},{"name":"nays","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ipfsHash","type":"string"}],"name":"checkDeadline","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_author","type":"address"}],"name":"getReputation","outputs":[{"name":"reputation","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPendingBalance","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]; 
const contractAddress = '0xc34225de67f322d70961ae78a9e4dbd880e68089';
var miningEvent = new web3Events.eth.Contract(contractABI, contractAddress);


var app = express();
var ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

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

const articlesDbName = 'stimulus-articles';
const usersDB = 'stimulus-users';

var newsPool = [];
var orbitdb;
var db;
var dbuser;

node.on('ready', async () => {
    console.log("Node ready")
    orbitdb = new OrbitDB(node);
    const accessdb = {
        write: ['*'],
        sync: true,
    }
    const accessuserdb = {
        write: ['*'],
        sync: true,
        directory: './userdb',
    }
    db = await orbitdb.docstore(articlesDbName, accessdb);
    dbuser = await orbitdb.docstore(usersDB, accessuserdb);
    Util.setDB(db);
    Util.setUserDB(dbuser);
    await db.load();
    await dbuser.load();
    //     , {
    //     create: true,
    //     overwrite: true,
    //     write: ['*'],
    // });
    console.log("DB0: "+db.address.toString());
    // console.log("DB0 ud: "+dbuser.address);
    console.log("DB0 connected...");
    app.emit('ready');
});

app.on('ready', function() {
    console.log("Preparing...");
    //Import only after the app is ready
    const NewsRoute = require('./news');
    const ChannelRoute = require('./channel');

    //Periodically check the deadline of articles in the newspool
    setInterval(()=>{
        console.log("Mining...")
        while(newsPool.length != 0) {
            // var vote = (Math.random()*10 + 1 > 5) ? true : false;
            var vote = true
            var article = newsPool.shift();
            var newsDetails = db.get(article);
            newsDetails[0].Mined = vote;
            db.put(newsDetails[0])
            console.log("Article: "+article+" vote: "+vote);
        }
    }, 30000);

    //Listens to accepted article events and updates the db
    miningEvent.events.Accepted(function(err, res) {
       if(res.returnValues.accepted) {
           var newsDetails = db.get(res.returnValues.ipfsHash);
           newsDetails[0].Mined = true;
           db.put(newsDetails[0]).then((tx) => console.log(tx));
       }
       else {
           //Delete from db is not accepted
           db.del(res.returnValues.ipfsHash);
       } 
    });

    app.use(fileupload());
    app.use(express.urlencoded());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use('/news', NewsRoute);
    app.use('/channel', ChannelRoute);
    
    
    app.post('/upload', (req, res) => {
        var file = req.files.upload;
        var newsTitle = req.body.title;
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
                    var addr = Util.getAddressFromSig(signature, phrase);
                    console.log(signature+" "+phrase+" Signed by: "+ addr);
                    if(Util.checkUserExists(addr)) {
                        var article = {_id: result[0].hash, title: newsTitle, author: addr, Mined: false, Published: false};
                        // orbitdb.docstore(articlesDbName).then((docstore) => {
                        //     docstore.put(article).then((hash) => console.log(hash));
                        // });
                        newsPool.push(result[0].hash);
                        db.put(article).then((hash) => console.log("Article Put: "+hash));
                        console.log("Written to DB");
                        res.send(200, { hash: result[0].hash, author: addr});
                    } else {
                        res.send(403, {error: "User does not exist. Please sign up"});
                    }
                    
                } catch(err) {
                    console.log(err);
                    res.send(500, err.toString());
                } 
            });
            
        })
    });
    
    app.post('/login', async (req, res) => {
        const name = req.body.name;
        const bio = req.body.bio;
        const sign = req.body.sign;
        const phrase = req.body.phrase;
        try {
            const address = Util.getAddressFromSig(sign, phrase);
            if(Util.checkUserExists(address)) {
                return res.send(200, {result: "Logged in"});
            }
            const userDetails = {_id: address, name: name, bio: bio, channel: [], reputation: 0};
            dbuser.put(userDetails).then((hash) => console.log(hash));
            res.send(200, {author: address, result: "Welcome!"});
        } catch(err) {
            console.log(err);
            res.send(500, {error: err.toString()});
        }
      });

    app.get('/:user', async (req, res) => {
        const user = req.params.user;
        try {
            const userDetails = dbuser.get(user);
            res.send(200, userDetails);
        } catch(err) {
            console.log(err);
        }
    });

    module.exports = app;
    console.log("Ready");
    app.listen(3000);
});



function repo () {
    return 'ipfs/stimulus/' + Math.random()
}

