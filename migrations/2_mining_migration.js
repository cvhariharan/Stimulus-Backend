var Mining = artifacts.require("./Mining.sol");
const tokenAddress = '0x35fc96236e097b78650b2953b428e1f444e0e76b';
module.exports = function(deployer) {
  deployer.deploy(Mining, tokenAddress);
};