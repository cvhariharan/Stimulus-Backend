var Node = require('ipfs');

var node = new Node({
    EXPERIMENTAL: {
      pubsub: true
    }
});

var ipfsGlobal = node;

const topic = 'active-stimulus-peers';

var msgReceiver = (msg) => console.log(msg.data.toString());

ipfsGlobal.on('ready', () => {

    ipfsGlobal.pubsub.subscribe(topic, msgReceiver, (err) => {
        if(err) {
            throw err;
        }
        console.log(`Subscribed to ${topic}`);
    });
    
    ipfsGlobal.pubsub.peers(topic, (err, peerIds) => {
        if(err) {
            throw err;
        }
        console.log(peerIds);
    });

});



