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
    }).then(async (con) => {
        console.log('DB connection Successfully!');
        await mongoose.connection.db.dropDatabase(console.log(`${mongoose.connection.db.databaseName} database dropped.`)
        );
    });

});

describe('EventController', function () {
    beforeEach(function (done) {
        mongoose.connection.db.dropDatabase(() => {
            console.log(`${mongoose.connection.db.databaseName} database dropped.`);
            done();
        });
    });
    describe('ConnectionEvent', function () {
        describe('Get All', function () {
            it("Return all connection event", async () => {
                const user = await User.create({
                    firstName: "test",
                    lastName: "test",
                    email: "email@email.test",
                    password: "012345678",
                    role: "admin"
                });

                const requester = chai.request(app).keepOpen()
                let res = await requester.post("/api/v1/users/login").send({
                    "email": "email@email.test",
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
                expect(res.body.data[0].user).to.be.equal(userData._id);

            });
        });
        describe('Get one', function () {
            it("Return nothing if the id specified is non existant", async () => {
                let user = await User.create({
                    firstName: "test",
                    lastName: "test",
                    email: "email@email.test",
                    password: "012345678",
                    role: "admin"
                });

                const requester = chai.request(app).keepOpen();
                let query = await requester.post("/api/v1/users/login").send({
                    "email": "email@email.test",
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
            });
        });
        describe('Get event made by user', function () {
            it("Return the event made by the user", async () => {
                let user = await User.create({
                    firstName: "test",
                    lastName: "test",
                    email: "email@email.test",
                    password: "012345678",
                    role: "admin"
                });

                const requester = chai.request(app).keepOpen();
                let query = await requester.post("/api/v1/users/login").send({
                    "email": "email@email.test",
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
            });
        });
    });
});

describe('ElementEvent', function () {
    let admin;
    let adminToken;
    let location;
    before(async ()=>{
        await mongoose.connection.db.dropDatabase(() => {
            console.log(`${mongoose.connection.db.databaseName} database dropped.`);
        });
         const user = await User.create({
            firstName: "test",
            lastName: "test",
            email: "email@email.test",
            password: "012345678",
            role: "admin"
        });

        const requester = chai.request(app)
        let res = await requester.post("/api/v1/users/login").send({
            "email": "email@email.test",
            "password": "012345678"
        });

        const body = res.body;
        admin = body.data.user;
        adminToken = body.token;
        location = await Location.create({
            name: "oe",
            address: {
                street: "sirTest",
                noStreet: 42,
                npa: 95,
                city: "Roosevelt",
                country: "Moon"
            }
        });
    })

    it("Element event is added when product is set", async () => {
        console.log(admin)
        console.log(adminToken)
        expect(true).to.be.true;
        // TODO waiting for further specification  about Element
    });

});

after(async function () {
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.")
    });
});