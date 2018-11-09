const app = require('express').Router();
const Express = require('express');
const IPFS = require('ipfs-api');
const Node = require('ipfs');
const OrbitDB = require('orbit-db');

app.use(Express.urlencoded());

var node = new Node({
    repo: 'ipfs/node1',
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
  var orbitdb;
  var db;
  const stimulusArticles = '/orbitdb/QmRffsUeGdDSms5EiqYNw69NCggegk5FutEujJ3yLT5FJd/stimulus-articles';
  node.on('ready', async () => {
      console.log("Node ready")
      orbitdb = new OrbitDB(node);
      const access = {
        write: ['*'],
        sync: true,
      }
      db = await orbitdb.docstore(stimulusArticles, access);
      await db.load();
      //     , {
      //     create: true,
      //     overwrite: true,
      //     write: ['*'],
      // });
      console.log("DB: "+db.address.toString())
      console.log("DB connected...");
});

app.post('/subscribe', (req,res) => {
  const phrase = req.body.phrase;
  const signature = req.body.sign;
  const user = getAddressFromSig(signature, phrase);
  console.log("Subscriber: "+user);

});

function getAddressFromSig(signature, phrase) {
  const { v, r, s } = ethUtil.fromRpcSig(signature);
  var signedPubKey = ethUtil.ecrecover(Buffer.from(phrase, 'utf8'), v, r, s);
  var addrBuf = ethUtil.pubToAddress(signedPubKey);
  var addr = ethUtil.bufferToHex(addrBuf);
  return addr;
}

module.exports = app;