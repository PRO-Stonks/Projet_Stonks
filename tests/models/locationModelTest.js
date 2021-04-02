'use strict';
const Location = require('../../models/locationModel');
const chai = require('chai');
const mongoose = require('mongoose');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

before(async function () {
    const database = process.env.DATABASE.replace(
        '${MONGO_USERNAME}', process.env.MONGO_USERNAME).replace(
        '${MONGO_PASSWORD}', process.env.MONGO_PASSWORD).replace(
        '${MONGO_HOSTNAME}', process.env.MONGO_HOSTNAME).replace(
        '${MONGO_PORT}', process.env.MONGO_PORT).replace(
        '${MONGO_DB}', process.env.MONGO_DB_TEST);

    console.log(database);

// Connect the database
    await mongoose.connect(database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(con => {
        console.log('DB connection Successfully!');
        mongoose.connection.db.dropDatabase(console.log(`${mongoose.connection.db.databaseName} database dropped.`)
        );
    });

})

describe('LocationModel', function () {
    describe('Missing Element', function () {
        Object.keys(Location.schema.obj).forEach((key) => {
            let test = {
                name: "test",
                address: {
                    street: "sirTest",
                    noStreet: 42,
                    npa: 95,
                    city: "Roosevelt",
                    country: "Moon"
                }
            };
            delete test[key];
            it('should throws when ' + key + ' is not present', async () => {
                await expect(Location.create(test)).to.be.rejectedWith(Error);
            });
        });
    });

    describe('Missing Element in address', function () {
        Object.keys(Location.schema.obj.address).forEach((key) => {
            if (Location.schema.obj.address[key].hasOwnProperty('required')) {
                let test = {
                    name: "test",
                    address: {
                        street: "sirTest",
                        noStreet: 42,
                        npa: 95,
                        city: "Roosevelt",
                        country: "Moon"
                    }
                };
                delete test.address[key];
                it('should throws when ' + key + ' is not present', async () => {
                    await expect(Location.create(test)).to.be.rejectedWith(Error);
                });
            }
        });
    });

});