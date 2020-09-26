const {Reservation, ReservationModel} = require('../../models/reservation')

class BookingPort {
    checkin = function(reservation, callback) {
           ReservationModel.save(reservation, (data) => {
                callback({
                    success: true,
                    id: data['_id'].toString()
                })
           });
       }

    checkedDates(reservation, callback) {
        ReservationModel.findAll(reservation, data => {
            callback({
                ordersDates: {orderDates: data.map(reservation => {
                     const obj = {
                        date_from: new Date(reservation.date_from).toISOString().split('T')[0],
                        date_to: new Date(reservation.date_to).toISOString().split('T')[0]
                     }
                    return obj;

                })}
            })
        });
    }
}

class BookingService {
    BookingPort = new BookingPort()
}

module.exports = BookingService
