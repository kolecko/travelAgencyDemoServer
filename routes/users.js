var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/login', function(req, res, next) {
  var soap = require('soap');
  var url = 'http://pis.predmety.fiit.stuba.sk/pis/ws/Customer?WSDL';

  var argsPassword = {
    id: req.body.team,
    password: req.body.password
  }
  var argsUser = {
    email: req.body.email
  };


  soap.createClient(url, function(err, client) {
    client.checkPassword(argsPassword, function(err, resultPassword) {
      if (resultPassword.exists === true) {
        client.getCustomerByEmail(argsUser, function(err, resultUser) {
          if (resultUser.hasOwnProperty('customer')) {
            res.json({status: true, customer: resultUser.customer});
          } else {
            res.json({status: false});
          }
        });
      } else {
        res.json({status: false});
      }
    })
  });
});

module.exports = router;
