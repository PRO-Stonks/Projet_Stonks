'use strict';
const QR = require('../../models/QRModel');
const chai = require('chai');
const mongoose = require('mongoose');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});
let value;
let value1;
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

describe('QRModel', function () {
    describe('Missing Element', function () {
        Object.keys(QR.schema.obj).forEach((key) => {
            let test = {
                code: new mongoose.Types.ObjectId()
            };
            delete test[key];
            it('should throws when ' + key + ' is not present', async () => {
                await expect(QR.create(test)).to.be.rejectedWith(Error);
            });
        });
    });
    describe('Code', function () {
        it('should throws when same value is used both time', async () => {
            value1 = new mongoose.Types.ObjectId();
            await QR.create({
                code: value1
            }).then(async (res) => {
                await QR.create({
                    code: value1
                }).catch(err => {
                    if (err instanceof mongoose.Error.ValidationError) {
                        expect(err.errors.hasOwnProperty("code")).to.be.true;
                        expect(err._message).to.be.equal("QR validation failed");
                    }
                })
            });
        });
    });
    describe('Creation', function () {
        it('should create the correct QR', async () => {
            value = new mongoose.Types.ObjectId();
            await QR.create({
                code: value
            }).then((data) => {
                expect(data.code).to.be.equal(value.toString());
                expect(data.id).to.be.not.empty;
            });
        });
    });
});

after(async function () {
    await QR.deleteMany({
        code: value
    });
    await QR.deleteMany({
        code: value1
    });
});

