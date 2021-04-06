'use strict';

const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const app = require("../../app");
const validator = require("validator");
const mongoose = require('mongoose');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require("chai-http"));
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});
const timeoutDuration = 3000;

let token;
before(async function () {
    const database = process.env.DATABASE.replace(
        '${MONGO_USERNAME}', process.env.MONGO_USERNAME).replace(
        '${MONGO_PASSWORD}', process.env.MONGO_PASSWORD).replace(
        '${MONGO_HOSTNAME}', process.env.MONGO_HOSTNAME).replace(
        '${MONGO_PORT}', process.env.MONGO_PORT).replace(
        '${MONGO_DB}', process.env.MONGO_DB_TEST);

    // Connect DB
    await mongoose.connect(database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(() => {
        console.log('DB connection Successfully!');
        mongoose.connection.db.dropDatabase(console.log(`${mongoose.connection.db.databaseName} database dropped.`)
        );
    });

    // Create admin user, log-in and get token
    token = await User.create({
        firstName: "test",
        lastName: "test",
        email: "email@email.tests",
        password: "012345678",
        role: "admin"
    }).then(() => {
        return chai.request(app)
            .post("/api/v1/users/login")
            .send({
                "email": "email@email.tests",
                "password": "012345678"
            })
            .timeout(timeoutDuration)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Log in successfully");
                    return res.body.token;
                } else {
                    throw "failed to log in";
                }
            });
    });
});

describe('productController', function () {
    describe('Add product', function () {
        it('should get a product as admin', async () => {

            // Add a product
            await chai
                .request(app)
                .post("/api/v1/products/add")
                .set("Authorization", "Bearer " + token)
                .send({
                    name: "test",
                    tag: "junk food"
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(201);
                    expect(res.body.status).to.be.equal('success');
                    expect(validator.isMongoId(res.body.data.doc._id)).to.be.true;
                });
        });
    });
});

after(async function () {
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.")
    });

})