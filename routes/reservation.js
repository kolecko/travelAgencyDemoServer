var express = require('express');
var router = express.Router();

router.post('/pay', function(req, res, next) {
    var soap = require('soap');
    var urlPayment = 'http://pis.predmety.fiit.stuba.sk/pis/ws/Students/Team092payment?WSDL';
    var argsPayment = {
        team_id: '092',
        team_password: '7ZJ6D3',
        payment: {
            name: req.body.reservation_id + req.body.card_holder,
            created_at: (new Date()).toISOString().split('T')[0],
            reservation_id: req.body.reservation_id,
            card_holder: req.body.card_holder
        }
    }

    var urlUser = 'http://pis.predmety.fiit.stuba.sk/pis/ws/Customer?WSDL';
    var argsUser = {
        id: req.body.customer_id
    }

    var urlEmail = 'http://pis.predmety.fiit.stuba.sk/pis/ws/NotificationServices/Email?WSDL';

    soap.createClient(urlPayment, function(errPayment, clientPayment) {
        clientPayment.insert(argsPayment, function(errPaymentClient, resultPayment) {

           // Read user from WS
           soap.createClient(urlUser, function(errUser, clientUser) {
               clientUser.getCustomerById(argsUser, function (errUserClient, resultUser) {

                   var argsEmail = {
                       team_id: '092',
                       password: '7ZJ6D3',
                       email: resultUser.customer.email,
                       subject: 'Rezervácia evidovaná',
                       message: 'Platba objednávky '
                                  + req.body.reservation_id
                                  + ' bola úspešne vykonaná.'
                   }

                   // Send email from WS
                   soap.createClient(urlEmail, function(errEmail, clientEmail) {
                       clientEmail.notify(argsEmail, function (errEmailClient, resultEmail) {});
                   });

               });
           });

            res.json(resultPayment);
        });
    });
})

router.post('/', function(req, res, next) {
    var soap = require('soap');
    var urlBooking = 'http://localhost:3001/wsdl/booking?WSDL';
    var argsBooking = req.body;

    var urlUser = 'http://pis.predmety.fiit.stuba.sk/pis/ws/Customer?WSDL';
    var argsUser = {
        id: req.body.customer_id
    }

    var urlEmail = 'http://pis.predmety.fiit.stuba.sk/pis/ws/NotificationServices/Email?WSDL';

    soap.createClient(urlBooking, function(errBooking, clientBooking) {
        clientBooking.checkin(argsBooking, function(errBookingClient, resultBooking) {

            // Read user from WS
            soap.createClient(urlUser, function(errUser, clientUser) {
                clientUser.getCustomerById(argsUser, function (errUserClient, resultUser) {

                    var argsEmail = {
                        team_id: '092',
                        password: '7ZJ6D3',
                        email: resultUser.customer.email,
                        subject: 'Rezervácia evidovaná',
                        message: 'Vaša rezervácia na dni '
                                   + (new Date(req.body.date_from)).toISOString().split('T')[0]
                                   + ' až '
                                   + (new Date(req.body.date_to)).toISOString().split('T')[0]
                                   + ' je evidovaná pod tokenom ' + resultBooking.id + ', no zatiaľ neuhradená'
                    }

                    // Send email from WS
                    soap.createClient(urlEmail, function(errEmail, clientEmail) {
                        clientEmail.notify(argsEmail, function (errEmailClient, resultEmail) {});
                    });

                });
            });

            res.json(resultBooking);
        });
    });
})

router.get('/:offerId', function(req, res, next) {
    var soap = require('soap');
    var url = 'http://localhost:3001/wsdl/booking?WSDL';
    var args = {
        offer_id: req.params.offerId
    };

    soap.createClient(url, function(err, client) {
        client.checkedDates(args, function(err, result) {
            if (result.ordersDates == null) {
                result.ordersDates = {
                    orderDates: []
                }
            } else if (!Array.isArray(result.ordersDates.orderDates)) {
                result.ordersDates.orderDates = [result.ordersDates.orderDates]
            }

            res.json(result);
        });
    });
});

module.exports = router;
