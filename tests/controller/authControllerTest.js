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
    beforeEach(function (done) {
        mongoose.connection.db.dropDatabase(() => {
            console.log(`${mongoose.connection.db.databaseName} database dropped.`);
            done();
        });
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
        it("Successful login Create a ConnectionEvent Entry", (done) => {
            User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
            }).then( user => {
                chai
                    .request(app)
                    .post("/api/v1/users/login").send({
                    "email": "email@email.test",
                    "password": "012345678"
                }).then(async res => {
                    await ConnectionEvent.find({}, function(err, docs){
                        expect(docs.length).to.be.not.equal(0);
                        expect(docs[0].kind).to.be.equal("ConnectionEvent");
                        return true;
                    }).exec();
                    done();
                }).catch(function (err) {
                    throw err;
                });
            });
        });
        it("Protected route need an authorisation token", (done) => {
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
                }).then(async res => {
                    console.log(res.body);
                    chai
                        .request(app)
                        .get("/api/v1/events/connections/").send().then(res => {
                        console.log(res.body);
                        expect(res.status).to.be.equal(401);
                        expect(res.body.status).to.be.equal('fail');
                        expect(res.body.message).to.be.equal("You are not logged in! Please login in to continue");
                    });
                    done();
                }).catch(function (err) {
                    throw err;
                });
            });
        });
        it("Admin only route need token", (done) => {
            User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
            }).then(user => {
                const requester = chai.request(app).keepOpen()
                requester.post("/api/v1/users/login").send({
                    "email": "email@email.test",
                    "password": "012345678"
                }).then( res => {
                    requester
                        .get("/api/v1/events/connections/")
                        .set('Authorization', 'Bearer '+res.body.token)
                        .send().then(res => {
                        expect(res.status).to.be.equal(403);
                        expect(res.body.status).to.be.equal('fail');
                        expect(res.body.message).to.be.equal("You are not allowed to do this action");
                        done();
                    });
                }).catch(function (err) {
                    throw err;
                });
            });
        });
        it("Admin can acces admin only route", (done) => {
            User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
                role: "admin"
            }).then(user => {
                const requester = chai.request(app).keepOpen()
                requester.post("/api/v1/users/login").send({
                    "email": "email@email.test",
                    "password": "012345678"
                }).then( res => {
                     requester
                        .get("/api/v1/events/connections/")
                        .set('Authorization', 'Bearer '+res.body.token)
                        .send().then(res => {
                        console.log(res.body)
                        expect(res.body.results).to.be.greaterThan(0);
                        expect(res.status).to.be.equal(200);
                        expect(res.body.status).to.be.equal('success');
                        done();
                    });
                }).catch(function (err) {
                    throw err;
                });
            });
        });
    });
});

after(async function () {
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.")
    });
});
