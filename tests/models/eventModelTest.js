'use strict';
const {Event, ConnectionEvent, OrderEvent, ProductEvent} = require('../../models/eventModel');
const chai = require('chai');
const mongoose = require('mongoose');
const validator = require("validator");
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

});
// 606afdb5aa09d43a84b6181a
describe('EventModel', function () {
    describe('Base event', function () {
        it('is created correctly', async () => {
            await Event.create({}).then(res => {
                expect(res).to.have.property("time");
                expect(validator.isDate(res.time)).to.be.true;
                expect(validator.isMongoId(res._id.toString())).to.be.true;
            });
        });
    });
    describe('Connection event', function () {
        describe('Missing elements', function () {
            Object.keys(ConnectionEvent.schema.obj).forEach((key) => {
                if (ConnectionEvent.schema.obj[key].hasOwnProperty('required')) {
                    let test = {
                        ip: "127.0.0.1",
                        userAgent: "Red Star OS 4",
                        user: "606afdb5aa09d43a84b6181a",
                    };
                    delete test[key];
                    it('should throws when ' + key + ' is not present', async () => {
                        await expect(ConnectionEvent.create(test)).to.be.rejectedWith(Error);
                    });
                }
            });
        });
        describe('IP', function () {
            it('should throws when value is not a correct ip', async () => {
                await expect(ConnectionEvent.create({
                    ip: "127.0.",
                    userAgent: "Red Star OS 4",
                    user: "606afdb5aa09d43a84b6181a"
                })).to.be.rejectedWith(Error);
            });
        });
        describe('user', function () {
            it('should throws when value is not a correct id', async () => {
                await expect(ConnectionEvent.create({
                    ip: "127.0.",
                    userAgent: "Red Star OS 4",
                    user: "606afdb5aa09d43a8"
                })).to.be.rejectedWith(Error);
            });
        });
    });
    describe('Order event', function () {
        describe('Missing elements', function () {
            Object.keys(OrderEvent.schema.obj).forEach((key) => {
                if (OrderEvent.schema.obj[key].hasOwnProperty('required')) {
                    let test = {
                        order: "606afdb5aa09d43a84b6181a",
                        user: "606afdb5aa09d43a84b6181a",
                    };
                    delete test[key];
                    it('should throws when ' + key + ' is not present', async () => {
                        await expect(OrderEvent.create(test)).to.be.rejectedWith(Error);
                    });
                }
            });
        });
        describe('order', function () {
            it('should throws when value is not a correct id', async () => {
                await expect(OrderEvent.create({
                    order: "606afdb5aa09d43a84b618",
                    user: "606afdb5aa09d43a84b6181a",
                })).to.be.rejectedWith(Error);
            });
        });
        describe('user', function () {
            it('should throws when value is not a correct id', async () => {
                await expect(OrderEvent.create({
                    order: "606afdb5aa09d43a84b6181a",
                    user: "606afdb5aa09d43a84b618",
                })).to.be.rejectedWith(Error);
            });
        });
    });
    describe('Product event', function () {
        describe('Missing elements', function () {
            Object.keys(ProductEvent.schema.obj).forEach((key) => {
                if (ProductEvent.schema.obj[key].hasOwnProperty('required')) {
                    let test = {
                        product: "606afdb5aa09d43a84b6181a",
                        user: "606afdb5aa09d43a84b6181a",
                    };
                    delete test[key];
                    it('should throws when ' + key + ' is not present', async () => {
                        await expect(ProductEvent.create(test)).to.be.rejectedWith(Error);
                    });
                }
            });
        });
        describe('Product', function () {
            it('should throws when value is not a correct id', async () => {
                await expect(ProductEvent.create({
                    product: "606afdb5aa09d43a84b618",
                    user: "606afdb5aa09d43a84b6181a",
                })).to.be.rejectedWith(Error);
            });
        });
        describe('user', function () {
            it('should throws when value is not a correct id', async () => {
                await expect(ProductEvent.create({
                    product: "606afdb5aa09d43a84b6181a",
                    user: "606afdb5aa09d43a84b618",
                })).to.be.rejectedWith(Error);
            });
        });
        describe('change', function () {
            it('should throws when value is not in the enum', async () => {
                await expect(ProductEvent.create({
                    product: "606afdb5aa09d43a84b6181a",
                    user: "606afdb5aa09d43a84b618",
                    change: "Nothing"
                })).to.be.rejectedWith(Error);
            });
        });
        describe('change', function () {
            it('should throws when value is not in the enum', async () => {
                await expect(ProductEvent.create({
                    product: "606afdb5aa09d43a84b6181a",
                    user: "606afdb5aa09d43a84b618",
                    change: "Nothing"
                })).to.be.rejectedWith(Error);
            });
        });
        describe('Old location', function () {
            it('should throws when value is missing', async () => {
                await expect(ProductEvent.create({
                    product: "606afdb5aa09d43a84b6181a",
                    user: "606afdb5aa09d43a84b6181a",
                    change: "Move"
                })).to.be.rejectedWith(Error);
            });
            it('should throws when value is not an id', async () => {
                await expect(ProductEvent.create({
                    product: "606afdb5aa09d43a84b6181a",
                    user: "606afdb5aa09d43a84b6181a",
                    change: "Move",
                    oldLocation: "606afdb5aa09d43a84b618"
                })).to.be.rejectedWith(Error);
            });
            it('should throws when value is specified when it should not', async () => {
                await expect(ProductEvent.create({
                    product: "606afdb5aa09d43a84b6181a",
                    user: "606afdb5aa09d43a84b6181a",
                    change: "Creation",
                    oldLocation: "606afdb5aa09d43a84b6181a"
                })).to.be.rejectedWith(Error);
            });
            it('should resolve when everything is ok',  () => {
                return  expect(ProductEvent.create({
                    product: "606afdb5aa09d43a84b6181a",
                    user: "606afdb5aa09d43a84b6181a",
                    change: "Move",
                    oldLocation: "606afdb5aa09d43a84b6181a"
                })).to.be.fulfilled;
            });
        });
    });
});


after(async function () {
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.")
    });

})