var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var soap = require('soap');
    var url = 'http://pis.predmety.fiit.stuba.sk/pis/ws/Students/Team092offer?WSDL';
    var args = {};
    soap.createClient(url, function(err, client) {
        client.getAll(args, function(err, result) {
            res.json(result);
        });
    });
});

module.exports = router;
