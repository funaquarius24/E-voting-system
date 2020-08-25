import express from 'express';
import path from 'path';

//import favicon from 'serve-favicon';

import logger from 'morgan';
import cookieParser from 'cookie-parser'; 
import bodyParser from 'body-parser';
import index from './routes/index';
import candidates from './routes/candidates';
import blockchain from './routes/blockchain';
import { Drizzle, generateStore } from "@drizzle/store";


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var mysql = require("mysql");
//Database connection
app.use(function(req, res, next){
	res.locals.connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'candidates'
	});
  console.log("################################")
	next();
});


//import drizzleApp from '../config/drizzleApp';
import Web3 from 'web3'
import Ballot from './contracts/Ballot.json';
import config from './config/config.json';

var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
web3.eth.defaultAccount = web3.eth.accounts[0];
var contractOptions = {from: web3.eth.accounts[0], gasPrise: '20000000000'};
var myContract = new web3.eth.Contract(Ballot.abi, config.contract_address, contractOptions);

app.use(function(req, res, next){
  
  res.locals.web3 = web3;
  res.locals.myContract = myContract;
  
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
      app.locals.contractAccount = accounts[0];
      //console.log(web3.eth.accounts[0]);
		}

  })();
  console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");

	next();
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/candidates', candidates);
app.use('/blockchain', blockchain);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



export default app;

