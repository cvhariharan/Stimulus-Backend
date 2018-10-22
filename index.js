const Node = require('ipfs');
const Room = require('ipfs-pubsub-room');
const externalip = require('externalip');

// var peer_ips = {};
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

var msgReceiver = (msg) => console.log(msg.data.toString());

var peer_ips = new Map();

node.on('ready', () => {
    const room = Room(node, topic);

    node.id(function (err, identity) {
      if (err) {
        throw err;
      }
      peerID = identity.id;
      externalip((err, ip) => {
        console.log(ip);
        room.broadcast(ip.toString());
      });
      // room.on('peer joined', (peer) => {
      //   console.log('Peer joined the room', peer);
      //   room.broadcast(peerID);
      // })
    
      // room.on('peer left', (peer) => {
      //   console.log('Peer left...', peer)
      //   console.log("IP left: "+peer_ips.get(peer.toString()));
      //   // delete peer_ips[peer.toString()];
      //   peer_ips.delete(peer);
      //   console.log("Revised array: "+peer_ips);
      //   writeToFile(peer_ips);
      // })
    
      // Broadcast ip when subscribed to the room
      // room.on('subscribed', () => {
      //   console.log('Now connected!')
        
      // });
      
      // room.on('message', (message) => {
      //   console.log('From: '+message.from);
      //   console.log('Message: '+message.data);
      //   // peer_ips[message.from] = message.data.toString();
      //   if(message.from != peerID) {
      //     peer_ips.set(message.from, message.data.toString());
      //     console.log("Revised array: "+peer_ips);
      //     writeToFile(peer_ips);
      //   }
      // });

    });
});

// function writeToFile(peers) {
//   var peerIter = peers.entries();
//   for(const [key, value] of peerIter) {
//     console.log("File: "+value);
//   }
// }



