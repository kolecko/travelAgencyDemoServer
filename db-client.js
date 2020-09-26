const MongoClient = require('mongodb').MongoClient;

const _uri = "mongodb://jozko:totalSecret@localhost:27017/pis-reservation"

class Client extends MongoClient {
    constructor() {
        super(_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    }
}

module.exports = Client;

