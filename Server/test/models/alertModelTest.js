'use strict';

const chai = require('chai');
const mongoose = require('mongoose');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});
let value;
let value2;
const {ElementAlert, ProductAlert} = require('../../models/alertModel');
before(async function () {
    const database = process.env.DATABASE.replace(
        '${MONGO_USERNAME}', process.env.MONGO_USERNAME).replace(
        '${MONGO_PASSWORD}', process.env.MONGO_PASSWORD).replace(
        '${MONGO_HOSTNAME}', process.env.MONGO_HOSTNAME).replace(
        '${MONGO_PORT}', process.env.MONGO_PORT).replace(
        '${MONGO_DB}', process.env.MONGO_DB_TEST);


    // Connect the database
    await mongoose.connect(database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
})

describe('elementAlert', function () {
    describe('Missing Element', function () {
        Object.keys(ElementAlert.schema.obj).forEach((key) => {
            let test = {
                idElement: new mongoose.Types.ObjectId()
            };
            delete test[key];
            it('should throws when ' + key + ' is not present', async () => {
                await expect(ElementAlert.create(test)).to.be.rejectedWith(Error);
            });
        });
    });
    describe('Creation', function () {
        it('should create the correct alert', async () => {
            value = new mongoose.Types.ObjectId();
            await ElementAlert.create({
                idElement: value
            }).then((data) => {
                expect(data.idElement).to.be.equal(value);
                expect(data.id).to.be.not.empty;
            });
        });
    });
});
describe('productAlert', function () {
    describe('Missing Element', function () {
        Object.keys(ProductAlert.schema.obj).forEach((key) => {
            let test = {
                idProduct: new mongoose.Types.ObjectId()
            };
            delete test[key];
            it('should throws when ' + key + ' is not present', async () => {
                await expect(ProductAlert.create(test)).to.be.rejectedWith(Error);
            });
        });
    });
    describe('Creation', function () {
        it('should create the correct alert', async () => {
            value2 = new mongoose.Types.ObjectId();
            await ProductAlert.create({
                idProduct: value2
            }).then((data) => {
                expect(data.idProduct).to.be.equal(value2);
                expect(data.id).to.be.not.empty;
            });
        });
    });
});

after(async function () {
    await ElementAlert.deleteMany({
        idElement: value
    });
    await ProductAlert.deleteMany({
        idProduct: value2
    });
});

