const Mining = artifacts.require('Mining');
const ipfsHash = "QmQf1auccYoNECsum1cenf4usJVMdaYXZ8Q89WsMsAqhqZ";

const jsonrpc = '2.0'

const id = 0

const send = (method, params = []) =>
  web3.currentProvider.send({ id, jsonrpc, method, params })

const timeTravel = async seconds => {
  await send('evm_increaseTime', [seconds])
  await send('evm_mine')
}

contract('Mining', (accounts) => {
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
        });
    });

    it('Voting test after deadline', async function() {
        await timeTravel(80);
        return Mining.deployed().then(function(instance) {
            instance.vote(ipfsHash, true, {from: accounts[2]});
        });
    });
});