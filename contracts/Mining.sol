pragma solidity ^0.4.23;

import "./Token.sol";

contract Mining {
    Token token;

    struct Author {
        address id;
        uint reputation;
    }

    struct Article {
        string ipfsHash;
        uint durationInMinutes;
        uint yays;
        uint nays;
        address author;
        mapping(address => bool) voters;
        bool votingEnded;
    }

    struct Stats {
        uint accepted;
        uint rejected;
        uint reputation;
    }

    event VotingEnded(string ipfsHash);
    event Voted(string ipfsHash, address voter);
    event Accepted(string ipfsHash, bool accepted);
    event ReputationUpdate(address author, uint reputation);

    mapping(string => Article) articlesMap;
    mapping(address => bool) payoutList;
    mapping(address => Stats) reputations;

    // constructor(address tokenAddress) public {
    //     token = Token(tokenAddress);
    // }

    function addArticle(string ipfsHash, uint duration) public {
        require(articlesMap[ipfsHash].yays == 0, "Article already exists");
        Article memory newArticle = Article(ipfsHash, now + duration * 1 minutes, 1, 1, msg.sender, false);
        articlesMap[ipfsHash] = newArticle;
    }

    function vote(string ipfsHash, bool castVote) public {
        require(articlesMap[ipfsHash].yays > 0, "Article does not exist");
        require(articlesMap[ipfsHash].voters[msg.sender] == false, "You have already voted");
        // require(now <= articlesMap[ipfsHash].durationInMinutes, "Voting period ended");
        if(votingEnded(ipfsHash)) {
            revert("Voting period ended");
        } else {
            castVote ? articlesMap[ipfsHash].yays += 1 : articlesMap[ipfsHash].nays += 1;
            articlesMap[ipfsHash].voters[msg.sender] = true;
            emit Voted(ipfsHash, msg.sender);
        }
    }

    function getVotes(string ipfsHash) public view returns (uint yays, uint nays) {
        return (articlesMap[ipfsHash].yays, articlesMap[ipfsHash].nays);
    }

    function votingEnded(string ipfsHash) internal returns (bool done){
        address _author = articlesMap[ipfsHash].author;
        if(now > articlesMap[ipfsHash].durationInMinutes) {
            if(articlesMap[ipfsHash].yays > articlesMap[ipfsHash].nays) {
                payoutList[_author] = true;
                //Update stats
                reputations[_author].accepted += 1;
                emit Accepted(ipfsHash, true);
            } else {
                reputations[_author].rejected += 1;
                emit Accepted(ipfsHash, false);
            }
            updateReputation(_author);
            emit VotingEnded(ipfsHash);
            articlesMap[ipfsHash].votingEnded = true;
            return true;
        }
        return false;
    }

    function checkDeadline(string ipfsHash) public returns(bool){
        return votingEnded(ipfsHash);
    }

    function updateReputation(address _author) internal {
        uint _accepted = reputations[_author].accepted + 1;
        uint _rejected = reputations[_author].rejected + 1;
        uint _score = (_accepted * 100) / (_accepted + _rejected);
        reputations[_author].reputation = _score * 10;
        emit ReputationUpdate(_author, reputations[_author].reputation);
    }

    function getReputation(address _author) public view returns(uint reputation){
        return reputations[_author].reputation;
    }
    // function withdraw() public {
    //     if(payoutList[msg.sender]) {
    //         token.transfer(msg.sender, )
    //     }
    // }
}