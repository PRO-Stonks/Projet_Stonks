'use strict';
const User = require('../../models/userModel');
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

// Connect the database
    await mongoose.connect(database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

});

describe('UserModel', function () {
    describe('Missing Element', function () {
        Object.keys(User.schema.obj).forEach((key) => {
            if (User.schema.obj[key].hasOwnProperty('required')) {
                let test = {
                    firstName: "testUserModel",
                    lastName: "test",
                    email: "email@email.test",
                    password: "012345678",
                };
                delete test[key];
                it('should throws when ' + key + ' is not present', async () => {
                    await expect(User.create(test)).to.be.rejectedWith(Error);
                });
            }
        });
    });
    describe('Role', function () {
        it('should throws when value is not in the enum', async () => {
            await expect(User.create({
                firstName: "testUserModel",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
                role: "NOPE"
            })).to.be.rejectedWith(Error);
        });
    });
    describe('Password', function () {
        it('should throws when the length is too small', async () => {
            await expect(User.create({
                firstName: "testUserModel",
                lastName: "test",
                email: "email@email.test",
                password: "0123456",
            })).to.be.rejectedWith(Error);
        });
    });
    describe('Email', function () {
        it('should throws when the string is incorrectly formatted', async () => {
            await expect(User.create({
                firstName: "testUserModel",
                lastName: "test",
                email: "email@emailtest",
                password: "012345678",
            })).to.be.rejectedWith(Error);
        });
    });
    describe('Creation', function () {
        it('should work when everything is valid', async () => {
            await User.create({
                firstName: "testUserModel",
                lastName: "test",
                email: "emailmodelqqqq@email.test",
                password: "012345678",
            }).then((data) => {
                expect(data.active).to.be.true;
                expect(data.role).to.be.equal("manager");
                expect(data.firstName).to.be.equal("testUserModel");
                expect(data.lastName).to.be.equal("test");
                expect(data.email).to.be.equal("emailmodelqqqq@email.test");
                expect(data.password).to.not.be.equal("012345678");
                expect(data.id).to.be.not.empty;
            });
        });
        it('should throws when same email is used both time', async () => {
            await User.create({
                firstName: "testUserModel",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
            }).then(async (res) => {
                await User.create({
                    firstName: "testUserModel",
                    lastName: "test",
                    email: "email@email.test",
                    password: "012345678",
                }).catch(err => {
                    if (err instanceof mongoose.Error.ValidationError) {
                        expect(err.errors.hasOwnProperty("email")).to.be.true;
                        expect(err._message).to.be.equal("User validation failed");
                    }
                })
            });
        });
    });
});

// Must be the only one if executed with all files
after(async function () {
    // To be sure
    await User.deleteMany({
        firstName: "testUserModel"
    });
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.")
    });

});