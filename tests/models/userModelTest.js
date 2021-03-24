'use strict';
const User = require('../../models/userModel');
const chai = require('chai')
const mongoose = require('mongoose');
const expect = chai.expect
chai.use(require('chai-as-promised'))
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

before(function () {
    const database = process.env.DATABASE.replace(
        '${MONGO_USERNAME}', process.env.MONGO_USERNAME).replace(
        '${MONGO_PASSWORD}', process.env.MONGO_PASSWORD).replace(
        '${MONGO_HOSTNAME}', process.env.MONGO_HOSTNAME).replace(
        '${MONGO_PORT}', process.env.MONGO_PORT).replace(
        '${MONGO_DB}', process.env.MONGO_DB_TEST);

    console.log(database);

// Connect the database
    mongoose.connect(database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(con => {
        console.log('DB connection Successfully!');
        mongoose.connection.db.dropDatabase(console.log(`${connection.db.databaseName} database dropped.`)
        );
    });

})

describe('UserModel', function() {
    describe('Missing Firstname', function() {
        it('should throws when the value is not present', async () => {
            await expect(User.create({
                firstName: "",
                lastName: "test",
                email: "email@email.test",
                password: "012345678",
            })).to.be.rejectedWith(Error);
        });
    });
    describe('Missing Lastname', function() {
        it('should throws when the value is not present', async () => {
            await expect(User.create({
                firstName: "test",
                lastName: "",
                email: "email@email.test",
                password: "012345678",
            })).to.be.rejectedWith(Error);
        });
    });
    describe('Missing Lastname', function() {
        it('should throws when the value is not present', async () => {
            await expect(User.create({
                firstName: "test",
                lastName: "",
                email: "email@email.test",
                password: "012345678",
            })).to.be.rejectedWith(Error);
        });
    });
});