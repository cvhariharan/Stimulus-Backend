pragma solidity ^0.4.23;

contract Mining {
    
    struct Article {
        string ipfsHash;
        uint durationInMinutes;
        uint yays;
        uint nays;
        address author;
        mapping(address => bool) voters;
    }

    event VotingEnded(string ipfsHash);
    event Voted(string ipfsHash, address voter);

    mapping(string => Article) articlesMap;

    function addArticle(string ipfsHash, uint duration) public {
        require(articlesMap[ipfsHash].yays == 0, "Article already exists");
        Article memory newArticle = Article(ipfsHash, now + duration * 1 minutes, 1, 1, msg.sender);
        articlesMap[ipfsHash] = newArticle;
    }

    function vote(string ipfsHash, bool castVote) public {
        require(articlesMap[ipfsHash].yays > 0, "Article does not exist");
        require(articlesMap[ipfsHash].voters[msg.sender] == false, "You have already voted");
        // require(now <= articlesMap[ipfsHash].durationInMinutes, "Voting period ended");
        if(!votingEnded(ipfsHash)) {
            castVote ? articlesMap[ipfsHash].yays += 1 : articlesMap[ipfsHash].nays += 1;
            articlesMap[ipfsHash].voters[msg.sender] = true;
            emit Voted(ipfsHash, msg.sender);
        }
    }

    function getVotes(string ipfsHash) public view returns (uint yays, uint nays) {
        return (articlesMap[ipfsHash].yays, articlesMap[ipfsHash].nays);
    }

    function votingEnded(string ipfsHash) internal returns (bool){
        if(now >= articlesMap[ipfsHash].durationInMinutes) {
            emit VotingEnded(ipfsHash);
            return true;
        }
        return false;
    }
}