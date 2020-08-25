pragma solidity >=0.4.22 <0.7.0;

/// @title Voting with delegation.
contract Ballot {

    event VoteEvent(
        uint timestamp,
        address indexed _from,
        bytes10 indexed acronym,
        bytes32 _name
    );

    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    struct Voter {
        uint weight; // weight is accumulated by delegation   a
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        bytes10 vote;   // index of the voted proposal
    }

    // This is a type for a single proposal.
    struct Candidate {
        uint id;    //Makes it easier to identifu candidates
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
        bytes10 acronym;
    }

    address public chairperson;

    // This declares a state variable that
    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A mapping of candidates using party Acronym as key
    mapping(bytes10 => Candidate) public candidates;

    // An array of acronyms to make iterating easy
    bytes10[] acronyms;

    // A dynamically-sized array of `Candidate` structs.
    //Candidate[] public candidates;
    bytes32 public tester;
    
    bool public electionStarted = false ;
    bool public electionEnded = false;
    
    modifier electionNotStarted(){
        require(
            electionStarted == false && electionEnded == false,
            "This operation cannot be preformed as the election has already commenced."
        );
        _;
    }
    
    modifier electionNotEnded(){
        require(
            electionEnded == false,
            "This operation cannot be preformed as the election has already ended."
        );
        _;
    }
    
    modifier electionOngoing(){
        require(
            electionStarted == true,
            "This operation can only be performed when the election process is ongoing."
        );
        _;
    }

    /// Create a new ballot to choose one of `candidateNames`.
    constructor() public {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

    }

    uint public candidatesCount;

    //chairperson already has a right to vote
    uint public numVoters = 1;
    uint public numVoted;

    function addCandidate (bytes32 _name, bytes10 acronym) public electionNotStarted {
        require(
            msg.sender == chairperson,
            "Only chairperson can add candidate."
        );

        if(candidates[acronym].id == 0){
            acronyms.push(acronym);
            candidatesCount ++;

        }
        candidates[acronym] = Candidate(candidatesCount, _name, 0, acronym);
        //candidates.push(Candidate(candidatesCount, _name, 0));
    }

    function addCandidates (bytes32[] memory _names, bytes10[] memory acronymsReceived) public electionNotStarted {
        require(
            msg.sender == chairperson,
            "Only chairperson can add candidate."
        );

        for(uint i = 0; i < _names.length; i++){
            bytes10 acronym = acronymsReceived[i];

            if(candidates[acronym].id == 0){
                acronyms.push(acronym);
                candidatesCount ++;
                candidates[acronym] = Candidate(candidatesCount, _names[i], 0, acronym);
            }
            else{
                candidates[acronym].acronym = acronym;
                candidates[acronym].name = _names[i]; 
            }
            
        }

        //candidates.push(Candidate(candidatesCount, _name, 0));
    }

    // Give `voter` the right to vote on this ballost.
    // May only be called by `chairperson`.
    function giveRightToVote(address voter) public electionNotStarted {
        // If the first argument of `require` evaluates
        // to `false`, execution terminates and all
        // changes to the state and to Ether balances
        // are reverted.
        // It is often a good idea to use `require` to check if
        // functions are called correctly.
        // As a second argument, you can also provide an
        // explanation about what went wrong.
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0, "Already have a right to vote.");
        
        voters[voter].weight = 1;
        numVoters += 1;
    }

    /// Delegate your vote to the voter `to`.
    function delegate(address to) public electionNotStarted {
        address tempTo = to;
        // assigns reference
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "you already voted.");
        require(tempTo != msg.sender, "you don't vote for yourself");

        // forward the delegation as long as `tempTo` also delegated.
        // in general, such loops are very dangerous...
        while (voters[tempTo].delegate != address(0)) {
            tempTo = voters[tempTo].delegate;
            require(tempTo != msg.sender, "found loop in delegation");
        }
        sender.voted = true;
        sender.delegate = tempTo;
        Voter storage final_delegate = voters[tempTo];
        if (final_delegate.voted) {
            // to已经投票了 所以直接往增加voteCount
            candidates[final_delegate.vote].voteCount += sender.weight;
        } else {
            // 还没投票, 可以往权重里加
            final_delegate.weight += sender.weight;
        }
    }

    /// Give your vote (including votes delegated to you)
    /// to candidate `candidates[candidate].name`.
    function vote(bytes10 candidate, address voter) public electionNotEnded electionOngoing {
        Voter storage sender = voters[voter];
        require(sender.weight > 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = candidate;

        // If `candidate` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        candidates[candidate].voteCount += sender.weight;

        numVoted += sender.weight;

        // There is a warning with using timestamp but since it's only meant for information only,
        // it can be ignored
        emit VoteEvent(block.timestamp, voter, candidate, candidates[candidate].name);
    }

    /// @dev Computes the winning candidate taking all
    /// previous votes into account.
    function winningCandidate() public view
            returns (bytes10 winningCandidate_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < acronyms.length; p++) {
            if (candidates[acronyms[p]].voteCount > winningVoteCount) {
                winningVoteCount = candidates[acronyms[p]].voteCount;
                winningCandidate_ = acronyms[p];
            }
        }
    }
    
    function startElection() public electionNotStarted electionNotEnded {
        electionStarted = true;
    }
    
    function endElection() public electionOngoing electionNotEnded {
        electionEnded = true;
    }

    // Calls winningCandidate() function to get the index
    // of the winner contained in the candidates array and then
    // returns the name of the winner
    function winnerName() public view
            returns (bytes32 winnerName_)
    {
        winnerName_ = candidates[winningCandidate()].name;
    }
    
    function getStats() public view 
            returns (bytes10[] memory, uint[] memory)
    {
        uint[] memory numVotes = new uint[](acronyms.length);
        for (uint p = 0; p < acronyms.length; p++) {
            numVotes[p] = candidates[acronyms[p]].voteCount;
        }
        
        return (acronyms, numVotes);
    }
}
