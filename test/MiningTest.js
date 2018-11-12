const Mining = artifacts.require('Mining');
const ipfsHash = "QmQf1auccYoNECsum1cenf4usJVMdaYXZ8Q89WsMsAqhqZ";
const testFileHash = "QmQf1auccYoNECsum1cenf4usJVMdaYXZ8Q89WsMsAqhuYt";
const jsonrpc = '2.0'

const id = 0

const send = (method, params = []) =>
  web3.currentProvider.send({ id, jsonrpc, method, params })

const timeTravel = async seconds => {
  await send('evm_increaseTime', [seconds])
  await send('evm_mine')
}

contract('Mining', (accounts) => {
    it('Checks initial reputation', async function() {
        return Mining.deployed().then(function(instance) {
            return instance.getReputation(accounts[3]);
        }).then(function(repu) {
            assert.equal(repu[0], 0, "Accepted 0");
            assert.equal(repu[1], 0, "Rejected 0");
            assert.equal(repu[2], 0, "Reputation 0");
        });
    });

    it('Adds files', async function() {
        return Mining.deployed().then(function(instance) {
            instance.addArticle(ipfsHash, 1);
            return instance.getVotes(ipfsHash)
        }).then(function(votes) {
            assert.equal(votes[0], 1, "Yays set");
            assert.equal(votes[1], 1, "Nays set");
        })
    });

    it('Voting test Yay', async function() {
        return Mining.deployed().then(function(instance) {
            instance.vote(ipfsHash, true);
            return instance.getVotes(ipfsHash)
        }).then(function(votes) {
            assert.equal(votes[0], 2, "Yay vote re")
        });
    });

    // it('Voting test after deadline', async function() {
    //     await timeTravel(61);
    //     return Mining.deployed().then(function(instance) {
    //         return instance.vote(ipfsHash, true, {from: accounts[2]});
    //     });
    // });

    it('Fake Voting', async function() {
        return Mining.deployed().then(async function(instance) {
            instance.addArticle(testFileHash, 1, {from: accounts[3]});
            instance.vote(testFileHash, true, {from: accounts[0]});
            instance.vote(testFileHash, true, {from: accounts[1]});
            instance.vote(testFileHash, false, {from: accounts[2]});
            instance.vote(testFileHash, true, {from: accounts[4]});
            instance.vote(testFileHash, true, {from: accounts[5]});
            return instance;
            // return instance.getVotes(testFileHash);
        });
    });

    it('Checks reputation after voting ends', async function() {
        await timeTravel(80);
        return Mining.deployed().then(async function(instance) {
            instance.VotingEnded(function(err, res) {
                console.log(res.args.ipfsHash);
            })
            // instance.ReputationUpdate(function(err, res) {
            //     console.log(res.args.reputation.toNumber());
            // })
            await instance.checkDeadline(testFileHash);
            return instance.getReputation(accounts[3])
        }).then(function(repu) {
            console.log(repu.toNumber());
        });
    });
});