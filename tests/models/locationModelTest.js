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
    });

    mongoose.connection.on('connected', () => {
        console.log('DB connection Successfully!');
        mongoose.connection.db.dropDatabase(console.log(`${mongoose.connection.db.databaseName} database dropped.`));
    });

})

describe('LocationModel', function () {
    describe('Missing Element', function () {
        Object.keys(Location.schema.obj).forEach((key) => {
            if (Location.schema.obj[key].hasOwnProperty('required')) {
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
            }
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

    describe('Creation', function () {
        it('should create the correct Location', async () => {
            await Location.create({
                name: "test",
                address: {
                    street: "sirTest",
                    noStreet: 42,
                    npa: 95,
                    city: "Roosevelt",
                    country: "Moon"
                }
            }).then((data) => {
                console.log(data);
                expect(data.name).to.be.equal("test");
                expect(data.address.street).to.be.equal("sirTest");
                expect(data.address.noStreet).to.be.equal(42);
                expect(data.address.npa).to.be.equal(95);
                expect(data.address.city).to.be.equal("Roosevelt");
                expect(data.address.country).to.be.equal("Moon");
                expect(data.id).to.be.not.empty;
            });
        });
    });
});

after(async function(){
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.")
    });

})