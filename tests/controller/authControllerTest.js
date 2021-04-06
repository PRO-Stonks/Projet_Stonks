'use strict';

process.env.NODE_ENV = 'test';
const chai = require('chai');
const validator = require("validator");
const mongoose = require('mongoose');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require("chai-http"));
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});
const app = require("../../app");
const User = require("../../models/userModel");
const {ConnectionEvent} = require("../../models/eventModel");

const timeoutDuration = 3000;

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



describe('AuthControler', function () {
    beforeEach( function (done) {
        mongoose.connection.db.dropDatabase(() => {console.log(`${mongoose.connection.db.databaseName} database dropped.`);
            done();});
    });
    describe('Sign Up', function () {
        it("Fail sign up a new user with invalid parameter", (done) => {
            chai
                .request(app)
                .post("/api/v1/users/signup").send({
                firstName: "test",
                lastName: "test",
                email: "email@emai",
                password: "0123",
            }).end((err, res) => {
                console.log(res.body)
                expect(res.status).to.be.equal(400);
                expect(res.body.status).to.be.equal('Invalid Input');
                done();
            }).timeout(timeoutDuration);
        });
        it("Successfully sign up a new user", (done) => {
            chai
                .request(app)
                .post("/api/v1/users/signup").send({
                firstName: "test",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
            })
                .end((err, res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(201);
                    expect(res.body.status).to.be.equal('success');
                    expect(res.body.data.user.hasOwnProperty("password")).to.be.false;
                    expect(res.body.data.user.active).to.be.true;
                    expect(res.body.data.user.role).to.be.equal("manager");
                    expect(validator.isMongoId(res.body.data.user._id)).to.be.true;
                    done();
                }).timeout(timeoutDuration);
        });
        it("Successfully sign up a new admin", (done) => {
            chai
                .request(app)
                .post("/api/v1/users/signup").send({
                firstName: "test",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
                role: "admin"
            })
                .end((err, res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(201);
                    expect(res.body.status).to.be.equal('success');
                    expect(res.body.data.user.hasOwnProperty("password")).to.be.false;
                    expect(res.body.data.user.active).to.be.true;
                    expect(res.body.data.user.role).to.be.equal("admin");
                    expect(validator.isMongoId(res.body.data.user._id)).to.be.true;
                    done();
                }).timeout(timeoutDuration);
        });
    });

    describe('Login', function () {
        it("Wrong email fails the login process", (done) => {
            User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
            }).then(user => {
                chai
                    .request(app)
                    .post("/api/v1/users/login").send({
                    "email": "email@email",
                    "password": "012345678"
                }).end((err, res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                    expect(res.body.token).to.not.exist;
                    done();
                }).timeout(timeoutDuration);
            });
        });
        it("Wrong password fails the login process", (done) => {
            User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
            }).then(user => {
                chai
                    .request(app)
                    .post("/api/v1/users/login").send({
                    "email": "email@email.test",
                    "password": "0123456789"
                }).end((err, res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                    expect(res.body.token).to.not.exist;
                    done();
                }).timeout(timeoutDuration);
            });
        });
        it("Login with valid parameter works", (done) => {
            User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
            }).then(user => {
                chai
                    .request(app)
                    .post("/api/v1/users/login").send({
                    "email": "email@email.test",
                    "password": "012345678"
                }).end((err, res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal('success');
                    expect(res.body.token).to.exist;
                    expect(res.body.data.user.hasOwnProperty("password")).to.be.false;
                    expect(res.body.data.user.role).to.be.equal("manager");
                    expect(validator.isMongoId(res.body.data.user._id)).to.be.true;
                    expect(validator.isJWT(res.body.token)).to.be.true;
                    done();
                }).timeout(timeoutDuration);
            });
        });
        it("Sucessful login Create a ConnectionEvent Entry", (done) => {
            User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
            }).then(user => {
                chai
                    .request(app)
                    .post("/api/v1/users/login").send({
                    "email": "email@email.test",
                    "password": "012345678"
                }).end((err, res) => {
                    ConnectionEvent.find({}).then(res => {
                        console.log(res)
                        expect(res.length).to.be.greaterThan(0);
                        expect(res.kind).to.be.equal("ConnectionEvent");
                    });
                    done();
                }).timeout(timeoutDuration);
            });
        });
    });



    // TODO ADD test with duplicate email
    // Add test with access to protected route
    // Add test to verify behaviour of deleted users
});

after(async function () {
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.")
    });
});
