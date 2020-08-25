import express from 'express';
var router = express.Router();

import Ballot from '../contracts/Ballot.json';
import config from '../config/config.json';

var loadState = "testing";


router.get('/', function(req, res, next) { 
	var err = null;
	(async () => {
		console.log("start waiting");
		var accounts = await res.locals.web3.eth.getAccounts()
		.catch(function failureCallback(error) {
			err = "" + error;
			res.blockChainState = undefined;
			if(err.indexOf("on send()") !== -1){
				res.send("cannot open blockchain node");
				console.log(err)
			}
			else {
				res.send("Unknown error on blockchain node"); 
			}
		  } );

		if(err == null){ 
			let testing = function(){
				res.locals.myContract.methods.getStats().call({from: req.app.locals.contractAccount, gas: 2000000})
				.then(function(receipt){
					//res.send(res.locals.web3.utils.hexToAscii(receipt));
					var acronyms = receipt[0];
					var votes = receipt[1];
					var body = {};
					var count = 0;
					acronyms.forEach(element => {
						body[res.locals.web3.utils.hexToUtf8(element)] = votes[count];
						count++;
					});
					req.app.statsResult = body;
					console.log("A: " + body["A"]);
					
				}).catch(error => () => {
					console.log(error);
					res.send(error);

				});
			};
			testing();
			console.log("updating: " + req.app.updating)
			if(req.app.updating == null){
				setInterval(function() {
					testing();
					req.app.updating = true;
				}, 30000);
			}
			res.send("successfully connected to blockchain node" );
		}

	})();
	
});



/* GET candidates listing. */ 
router.post('/commitAll', function(req, res, next) {
	let body = req.body;
	let acronyms = [];
	let candidateNames = [];
	
	body.forEach(element => {		
		acronyms.push(res.locals.web3.utils.asciiToHex(element.Acronym));
		candidateNames.push(res.locals.web3.utils.asciiToHex(element.candidate_name));
	});
	res.locals.myContract.methods.addCandidates(
		candidateNames, 
		acronyms
	).send({from: req.app.locals.contractAccount, gas: 2000000})
	.then(function(receipt){
		if(receipt.status){
			res.send("successfully added candidates");
		}
	})
	.catch(function(error){
		console.log("caught error: " + error);
	});
	
});

/* GET candidates listing. */ 
router.post('/addCandidate', function(req, res, next) {
	res.locals.myContract.methods.addCandidate(
		req.name, 
		req.acronym
	).send({from: req.app.locals.contractAccount, gas: 2000000})
	.then(function(receipt){
		res.send(receipt);
	});
});

/* GET candidates listing. */ 
router.post('/newVoter', function(req, res, next) {
	res.locals.web3.eth.personal.newAccount('creating new account')
	.then(function(newAccount){
		res.newAccount = newAccount;
		res.locals.myContract.methods.giveRightToVote(
			newAccount
		).send({from: req.app.locals.contractAccount, gas: 2000000})
		
	}).then(function(receipt){
		res.send("Account: " + res.newAccount);
	}).catch(error => () => {
		res.send(error);
	});
});

router.post('/vote', function(req, res, next) {
	const data = req.body;
	console.log("Address: " + data.address + " Acronym: " + data.acronym);
	res.locals.myContract.methods.vote(
		res.locals.web3.utils.asciiToHex(data.acronym ), data.address
	).send({from: req.app.locals.contractAccount, gas: 2000000})
	.then(function(receipt){
		//res.send(receipt);
		res.send("Successfully Voted");
	})
	.catch((error) => {
		res.send(error + "");
		console.log(error);
	});
});

router.get('/winnerName', function(req, res, next) {
	res.locals.myContract.methods.winnerName().call({from: res.locals.web3.eth.address, gas: 2000000})
	.then(function(receipt){
		res.send(res.locals.web3.utils.hexToAscii(receipt));
	}).catch(error => () => {
		res.send(error);
	});
});

router.get('/stats', function(req, res, next) {
	if(req.app.statsResult == null ){
		res.send("error");
	}
	else{
		//console.log("called");
		res.send(req.app.statsResult);
	}
	
});


module.exports = router;
