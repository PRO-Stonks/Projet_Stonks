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

let user;
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

    user = await User.create({
        firstName: "testEvent",
        lastName: "test",
        email: "emailEvent@email.test",
        password: "012345678",
        role: "admin"
    });
});

describe('EventController', function () {
    describe('ConnectionEvent', function () {
        describe('Get All', function () {
            it("Return all connection event", async () => {
                const requester = chai.request(app).keepOpen()
                let res = await requester.post("/api/v1/users/login").send({
                    "email": "emailEvent@email.test",
                    "password": "012345678"
                });

                const body = res.body;
                const userData = body.data.user;
                res = await requester
                    .get("/api/v1/events/connections/")
                    .set('Authorization', 'Bearer ' + body.token)
                    .send()
                expect(res.body.results).to.be.greaterThan(0);
                expect(res.status).to.be.equal(200);
                expect(res.body.status).to.be.equal('success');
                expect(res.body.data[0].kind).to.be.equal("ConnectionEvent");
                requester.close();

            });
        });
        describe('Get one', function () {
            it("Return nothing if the id specified is non existant", async () => {
                const requester = chai.request(app).keepOpen();
                let query = await requester.post("/api/v1/users/login").send({
                    "email": "emailEvent@email.test",
                    "password": "012345678"
                });
                const body = query.body;
                const userData = body.data.user;
                query = await requester
                    .get("/api/v1/events/connections/" + "606c955dfb7fda73ac878a77")
                    .set('Authorization', 'Bearer ' + body.token)
                    .send();

                expect(query.status).to.be.equal(404);
                expect(query.body.status).to.be.equal('fail');
                expect(query.body.message).to.be.equal('No document found with that id');
                requester.close();
            });
        });
        describe('Get event made by user', function () {
            it("Return the event made by the user", async () => {
                const requester = chai.request(app).keepOpen();
                let query = await requester.post("/api/v1/users/login").send({
                    "email": "emailEvent@email.test",
                    "password": "012345678"
                });
                const body = query.body;
                const userData = body.data.user;
                query = await requester
                    .get("/api/v1/events/connections/user/" + userData._id)
                    .set('Authorization', 'Bearer ' + body.token)
                    .send();
                console.log(query.body.data)
                console.log(userData._id)
                expect(query.status).to.be.equal(200);
                expect(query.body.status).to.be.equal('success');
                expect(query.body.data[0].kind).to.be.equal("ConnectionEvent");
                expect(query.body.data[0].user).to.be.equal(userData._id);
                requester.close();
            });
        });
    });
});

after(async function () {
    await User.deleteMany({
        firstName: "testEvent"
    }).then(() => {
        console.log("Clean User in auth");
    });
    await ConnectionEvent.deleteMany({
        user: user._id
    }).then(() => {
        console.log("Clean Element");
    });
});