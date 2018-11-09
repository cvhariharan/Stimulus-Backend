//Create database
const Node = require('ipfs');
const OrbitDB = require('orbit-db');



// const dbName = 'stimulus-articles';



// function repo () {
//     return 'ipfs/stimulus/' + Math.random()
// }
class DBAdapter {
  
  constructor() {
    const dbName = 'stimulus-articles';
    const userdbName = 'stimulus-users';

      const node = new Node({
      repo: 'ipfs/node5',
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

    node.on('ready', async () => {
    const orbitdb = new OrbitDB(node);
    const access = {
        write: ['*'],
        sync: true,
    };
    this.db = await orbitdb.docstore(dbName, access);
    this.dbuser = await orbitdb.docstore(userdbName, access);
    console.log("DBA: "+this.db.address.toString());
    console.log("DBA: "+this.dbuser.address.toString());
  }); 

  }
}