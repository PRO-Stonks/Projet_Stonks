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

let user;
let admin;
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

    user = await User.create({
        firstName: "testAuth",
        lastName: "test",
        email: "managerAuth@email.test",
        password: "012345678",
    });
});

let userData = {}
describe('AuthControler', function () {
    describe('Sign Up', function () {
        it("Fail sign up a new user with invalid parameter", async () => {
            const res = await chai
                .request(app)
                .post("/api/v1/users/signup").send({
                    firstName: "testAuth",
                    lastName: "test",
                    email: "email@emai",
                    password: "0123",
                });
            expect(res.status).to.be.equal(400);
            expect(res.body.status).to.be.equal('Invalid Input');
        });
        it("Successfully sign up a new user", async () => {
            const res = await chai
                .request(app)
                .post("/api/v1/users/signup").send({
                    firstName: "testAuth",
                    lastName: "test",
                    email: "manager11@email.test",
                    password: "012345678",
                });
            expect(res.status).to.be.equal(201);
            expect(res.body.status).to.be.equal('success');
            expect(res.body.data.user.hasOwnProperty("password")).to.be.false;
            expect(res.body.data.user.active).to.be.true;
            expect(res.body.data.user.role).to.be.equal("manager");
            expect(validator.isMongoId(res.body.data.user._id)).to.be.true;

        });
        it("Successfully sign up a new admin", async () => {
            const res = await chai
                .request(app)
                .post("/api/v1/users/signup").send({
                    firstName: "testAuth",
                    lastName: "test",
                    email: "admin@email.test",
                    password: "012345678",
                    role: "admin"
                });
            admin = res;
            expect(res.status).to.be.equal(201);
            expect(res.body.status).to.be.equal('success');
            expect(res.body.data.user.hasOwnProperty("password")).to.be.false;
            expect(res.body.data.user.active).to.be.true;
            expect(res.body.data.user.role).to.be.equal("admin");
            expect(validator.isMongoId(res.body.data.user._id)).to.be.true;

        });
    });

    describe('Login', function () {
        it("Wrong email fails the login process", async () => {
            const res = await chai
                .request(app)
                .post("/api/v1/users/login").send({
                    "email": "email@email",
                    "password": "012345678"
                });
            expect(res.status).to.be.equal(401);
            expect(res.body.status).to.be.equal('fail');
            expect(res.body.token).to.not.exist;
        });
        it("Wrong password fails the login process", async () => {

            const res = await chai
                .request(app)
                .post("/api/v1/users/login").send({
                    "email": "managerAuth@email.test",
                    "password": "0123456789"
                });
            expect(res.status).to.be.equal(401);
            expect(res.body.status).to.be.equal('fail');
            expect(res.body.token).to.not.exist;
        });
        it("Login with valid parameter works", async () => {
            const res = await chai
                .request(app)
                .post("/api/v1/users/login").send({
                    "email": "managerAuth@email.test",
                    "password": "012345678"
                });
            expect(res.status).to.be.equal(200);
            expect(res.body.status).to.be.equal('success');
            await ConnectionEvent.deleteMany({
                user: res.body.data.user._id
            });
            expect(res.body.token).to.exist;
            expect(res.body.data.user.hasOwnProperty("password")).to.be.false;
            expect(res.body.data.user.role).to.be.equal("manager");
            expect(validator.isMongoId(res.body.data.user._id)).to.be.true;
            expect(validator.isJWT(res.body.token)).to.be.true;


        });

        it("Successful login Create a ConnectionEvent Entry", async () => {
            userData = await chai
                .request(app)
                .post("/api/v1/users/login").send({
                    "email": "managerAuth@email.test",
                    "password": "012345678"
                });
            const docs = await ConnectionEvent.find({}).exec();
            expect(docs.length).to.be.not.equal(0);
            expect(docs[0].kind).to.be.equal("ConnectionEvent");

        });
        after(async function () {
            try {
                await ConnectionEvent.deleteMany({
                    user: userData.body.data.user._id
                });
            } catch (e) {
                console.log(e)
            }

        });
        it("Protected route need an authorisation token", async () => {
            let res = await chai
                .request(app)
                .post("/api/v1/users/login").send({
                    "email": "managerAuth@email.test",
                    "password": "012345678"
                });
            await ConnectionEvent.deleteMany({
                user: res.body.data.user._id
            });
            res = await chai
                .request(app)
                .get("/api/v1/events/connections/").send();
            expect(res.status).to.be.equal(401);
            expect(res.body.status).to.be.equal('fail');
            expect(res.body.message).to.be.equal("You are not logged in! Please login in to continue");
        });

        it("Admin only route need token", async () => {
            const requester = chai.request(app).keepOpen()
            let res = await requester.post("/api/v1/users/login").send({
                "email": "managerAuth@email.test",
                "password": "012345678"
            });
            await ConnectionEvent.deleteMany({
                user: res.body.data.user._id
            });
            res = await requester
                .get("/api/v1/events/connections/")
                .set('Authorization', 'Bearer ' + res.body.token)
                .send();
            expect(res.status).to.be.equal(403);
            expect(res.body.status).to.be.equal('fail');
            expect(res.body.message).to.be.equal("You are not allowed to do this action");
            requester.close();
        });
        it("Admin can access admin only route", async () => {
            const requester = chai.request(app).keepOpen()
            let res = await requester.post("/api/v1/users/login").send({
                "email": "admin@email.test",
                "password": "012345678"
            });
            await ConnectionEvent.deleteMany({
                user: res.body.data.user._id
            })
            res = await requester
                .get("/api/v1/events/connections/")
                .set('Authorization', 'Bearer ' + res.body.token)
                .send();
            expect(res.body.results).to.be.greaterThan(0);
            expect(res.status).to.be.equal(200);
            expect(res.body.status).to.be.equal('success');
            requester.close();
        });
    });
});

after(async function () {
    await User.deleteMany({
        firstName: "testAuth"
    });
});
