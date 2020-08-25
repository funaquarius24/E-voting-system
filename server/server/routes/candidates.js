var express = require('express');
var router = express.Router();

/* GET candidates listing. */
router.get('/', function(req, res, next) {
 	res.locals.connection.query('SELECT * from partycandidates', function (error, results, fields) {
		if(error){
			console.log(error);
			res.send(error);
		}
		res.send(JSON.stringify(results));
	});
	res.locals.connection.end();
});


/* GET candidates listing. */
router.post('/edit', function(req, res, next) {
    var stmt = "UPDATE partycandidates SET candidate_name='" + req.body.candidateName + "' WHERE Acronym='" + req.body.Acronym + "'";
    console.log(stmt);
 	res.locals.connection.query(stmt, function (error, results, fields) {
		if(error){
			console.log(error);
			res.send(error);
		}
		res.send(JSON.stringify(results));
	});
	res.locals.connection.end();
	
});


module.exports = router;
