const ethUtil = require('ethereumjs-util');

const stimulusArticlesdb = '/orbitdb/QmRffsUeGdDSms5EiqYNw69NCggegk5FutEujJ3yLT5FJd/stimulus-articles';

var db;
var dbuser;

module.exports.setDB = function(articlesDB) {
    
    db = articlesDB;
    console.log("Adding to util: "+db.address);
}

module.exports.getDB = function() {
    console.log("Getting from Util: "+db.address);
    return db;
}

module.exports.getAddressFromSig = function (signature, phrase) {
    const { v, r, s } = ethUtil.fromRpcSig(signature);
    var signedPubKey = ethUtil.ecrecover(Buffer.from(phrase, 'utf8'), v, r, s);
    var addrBuf = ethUtil.pubToAddress(signedPubKey);
    var addr = ethUtil.bufferToHex(addrBuf);
    return addr;
} 

module.exports.stimulusArticlesdb = stimulusArticlesdb;