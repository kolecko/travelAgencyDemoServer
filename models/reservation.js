const DbClient = require('../db-client');

class Reservation {
   _customer_id;
   _offer_id;
   _date_from;
   _date_to;
   _persons;
   _price;
}

class ReservationModel {
    static async save(reservation, callback) {
        const dbClient = new DbClient();
        (async function(client, reservation, db) {
          try {
            await client.connect();
            db = client.db()
            reservation.created_at = new Date();
            await db.collection('reservations').insertOne(reservation, function(err, doc) {
                if (err != null) throw err;
                callback(reservation);
                client.close()
            });
          } catch (err) {
            console.log(err.stack);
          }
        })(dbClient, reservation);
    }

    static async findAll(likeReservation, callback) {
        const dbClient = new DbClient();
        await (async function(client, db) {
          try {
            await client.connect();
            db = client.db()
            await db.collection('reservations').find(likeReservation).toArray((err, docs) => {
               if (err != null) throw err;
               callback(docs)
               client.close()
            });
          } catch (err) {
            console.log(err.stack);
          }
        })(dbClient);
    }
}

module.exports = {Reservation, ReservationModel};
