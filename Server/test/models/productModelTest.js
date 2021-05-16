'use strict';
const Product = require('../../models/productModel');
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


    // Connect the database
    await mongoose.connect(database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
})

describe('ProductModel', function () {
    describe('Missing Element', function () {
        Object.keys(Product.schema.obj).forEach((key) => {
            if (Product.schema.obj[key].hasOwnProperty('required')) {
                let test = {
                    name: "ProducttestTest",
                    tag: "philosophical ignorance"
                };
                delete test[key];
                it('should throws when ' + key + ' is not present', async () => {
                    await expect(Product.create(test)).to.be.rejectedWith(Error);
                });
            }
        });
    });

    describe('Creation', function () {
        it('should create the correct Product (without lowQuantity)', async () => {
            await Product.create({
                name: "ProducttestTest",
                tag: "philosophical ignorance"
            }).then((data) => {
                expect(data.name).to.be.equal("ProducttestTest");
                expect(data.tag).to.be.equal("philosophical ignorance");
                expect(data.active).to.be.true;
                expect(data.lowQuantity).to.be.equal(0);
                expect(data.id).to.be.not.empty;
            });
        });
        it('should create the correct Product (with lowQuantity)', async () => {
            await Product.create({
                name: "ProducttestTest",
                tag: "philosophical ignorance",
                lowQuantity: 2
            }).then((data) => {
                expect(data.name).to.be.equal("ProducttestTest");
                expect(data.tag).to.be.equal("philosophical ignorance");
                expect(data.active).to.be.true;
                expect(data.id).to.be.not.empty;
                expect(data.lowQuantity).to.be.equal(2);
            });
        });
    });
});

after(async function () {
    await Product.deleteMany({
        name: "ProducttestTest"
    });
});




