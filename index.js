const Node = require('ipfs');
const Room = require('ipfs-pubsub-room');
const publicIP = require('public-ip');
const externalip = require('externalip');

var peer_ips = {};

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
  })

const topic = 'active-stimulus-peers';

var msgReceiver = (msg) => console.log(msg.data.toString());



node.on('ready', () => {
    const room = Room(node, topic);

    node.id(function (err, identity) {
      if (err) {
        throw err;
      }
      console.log("Identity: "+identity.id);
    })

    room.on('peer joined', (peer) => {
        console.log('Peer joined the room', peer)
    })
    
      room.on('peer left', (peer) => {
        console.log('Peer left...', peer)
        console.log("IP left: "+peer_ips[peer.toString()]);
        delete peer_ips[peer.toString()];
        console.log("Revised array: "+JSON.stringify(peer_ips));
      })
    
      // now started to listen to room
      room.on('subscribed', () => {
        console.log('Now connected!')
      })
      
      room.on('message', (message) => {
        console.log('From: '+message.from);
        console.log('Message: '+message.data);
        peer_ips[message.from] = message.data.toString();
        console.log("Revised array: "+JSON.stringify(peer_ips));
      });

});



