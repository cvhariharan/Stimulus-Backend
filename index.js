const Node = require('ipfs');
const Room = require('ipfs-pubsub-room');
const externalip = require('externalip');
const app = require('./js/server');

var peerID;
var node = new Node({
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

const topic = 'active-stimulus-peers';
const repeatPeriod = 100000;

var msgReceiver = (msg) => console.log(msg.data.toString());

var peer_ips = new Map();

node.on('ready', () => {
    const room = Room(node, topic);

    node.id(function (err, identity) {
      if (err) {
        throw err;
      }
      peerID = identity.id;
      setInterval(() => {
        externalip((err, ip) => {
          console.log(ip);
          room.broadcast(ip);
        });
      }, repeatPeriod);
  
      room.on('subscribed', () => {
        console.log('Now connected!')
      });
    });
});

console.log("DONE, starting server");
app.listen(3000);

