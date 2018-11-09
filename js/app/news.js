const app = require('express').Router();
const IPFS = require('ipfs-api');
const Node = require('ipfs');
const OrbitDB = require('orbit-db');


var node = new Node({
    repo: 'ipfs/node2',
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

const articlesDbName = 'stimulus-articles'


app.get('/:authorHash', (req, res) => {
    //Get all the articles written by the author
    const authorHash = req.params.authorHash;
    const order = req.query.order;

    // orbitdb.docstore(articlesDbName).then((db) => {
    //     console.log(db.query((doc) => doc.author == authorHash))
    // });

    // const all = db.query((doc) => doc.author = authorHash);
    console.log("Hash: "+authorHash);
    const all = db.query((doc) => {
      if(doc.author == undefined)
        return false;
      return doc.author == authorHash;
      // 
    });
    console.log(db.query(e => true));
    console.log("Author res: "+JSON.stringify(all));
    res.send({results: all});

});


module.exports = app;