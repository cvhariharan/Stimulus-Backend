const app = require('express').Router();
const Express = require('express');
const IPFS = require('ipfs-api');
const Node = require('ipfs');
const OrbitDB = require('orbit-db');
const Util = require('./util.js');

app.use(Express.urlencoded());

// var node = new Node({
//     repo: 'ipfs/node1',
//     start: true,
//     EXPERIMENTAL: {
//       pubsub: true
//     },
//     config: {
//       Addresses: {
//         Swarm: [
//           '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
//         ]
//       }
//     }
//   });
  var orbitdb;
  var db = Util.getDB();
  var dbuser = Util.getUserDB();
  // console.log("Got: ");
  const stimulusArticles = '/orbitdb/QmRffsUeGdDSms5EiqYNw69NCggegk5FutEujJ3yLT5FJd/stimulus-articles';
//   node.on('ready', async () => {
//       console.log("Node ready")
//       orbitdb = new OrbitDB(node);
//       const access = {
//         write: ['*'],
//         sync: true,
//       }
//       db = await orbitdb.docstore(stimulusArticles, access);
//       await db.load();
//       //     , {
//       //     create: true,
//       //     overwrite: true,
//       //     write: ['*'],
//       // });
//       console.log("DB1: "+db.address.toString())
//       console.log("DB connected...");
// });

app.post('/subscribe', (req,res) => {
  const phrase = req.body.phrase;
  const signature = req.body.sign;
  const channel = req.body.channel;
  const user = Util.getAddressFromSig(signature, phrase);
  console.log("Subscriber: "+user+" Channel: "+channel);

  //Add the channel to the user's subscribed(channel) list
  var userDetails = dbuser.get(user);
  var subscribed = userDetails[0].channel;
  if(typeof subscribed === 'undefined') {
    subscribed = [channel];
  }
  else {
    if(!subscribed.includes(channel)) {
      subscribed.push(channel);
    }
  }
  console.log(subscribed);
  userDetails[0].channel = subscribed;
  console.log("Userdetails: "+JSON.stringify(userDetails));
  dbuser.put(userDetails[0])
    .then((hash) => console.log("Added channel: "+channel+" to "+user+" hash: "+hash));
  res.send(200, {channel: channel, subscriber: user});
  });


module.exports = app;