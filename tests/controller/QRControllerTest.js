'use strict';

const QR = require("../../models/QRModel");
const User = require("../../models/userModel");
const app = require("../../app");
const validator = require("validator");
const mongoose = require('mongoose');
const mainRoute = "/api/v1";

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require("chai-http"));
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});
const timeoutDuration = 3000;

let tokenAdmin;
let tokenManager;
let idQR1;
let idQR2;
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
    }).then(async () => {
        console.log('DB connection Successfully!');
        await mongoose.connection.db.dropDatabase(console.log(`${mongoose.connection.db.databaseName} database dropped.`)
        );
    });

    // Create manager/admin accounts, log in and get their tokens
    tokenManager = await User.create({
        firstName: "test",
        lastName: "test",
        email: "manager@email.tests",
        password: "012345678",
    }).then(() => {
        console.log("Manager account created");
        return chai.request(app)
            .post(mainRoute + "/users/login")
            .send({
                "email": "manager@email.tests",
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
    tokenAdmin = await User.create({
        firstName: "test",
        lastName: "test",
        email: "admin@email.tests",
        password: "012345678",
        role: "admin"
    }).then(() => {
        console.log("Admin account created");
        return chai.request(app)
            .post(mainRoute + "/users/login")
            .send({
                "email": "admin@email.tests",
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

    // Create 2 QR
    idQR1 = await QR.create({
        code: "oe"
    }).then((doc) => {
        return doc._id
    });
    idQR2 = await QR.create({
        code: "eo"
    }).then((doc) => {
        return doc._id
    });
});


describe('QRController', function () {
    describe('Add QR', function () {
        it('should fail when not logged in or without token', async () => {
            // Add Location
            await chai.request(app)
                .post(mainRoute + "/QR/add")
                .send({
                    code: "test"
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            // Fake token
            let token = "fakeTokenIsNotVeryGentle"

            // Add QR
            await chai
                .request(app)
                .post(mainRoute + "/QR/add")
                .set("Authorization", "Bearer " + token)
                .send({
                    code: "test"
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                });
        });

        it('should fail as non-admin user', async () => {
            // Add QR
            await chai
                .request(app)
                .post(mainRoute + "/QR/add")
                .set("Authorization", "Bearer " + tokenManager)
                .send({
                    code: "test"
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should work as admin', async () => {
            // Add QR
            await chai
                .request(app)
                .post(mainRoute + "/QR/add")
                .set("Authorization", "Bearer " + tokenAdmin)
                .send({
                    code: "test"
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(201);
                    expect(res.body.status).to.be.equal('success');
                    expect(validator.isMongoId(res.body.data._id)).to.be.true;
                });
        });
    });


    describe('Get QR', function () {
        it('should fail when not logged in or without token', async () => {
            // Get QR
            await chai
                .request(app)
                .get(mainRoute + "/QR/" + idQR1)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            // Fake token
            let token = "fakeTokenIsNotVeryGentle";

            // Get QR
            await chai
                .request(app)
                .get(mainRoute + "/QR/" + idQR1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with invalid id', async () => {
            // Get QR
            await chai
                .request(app)
                .get(mainRoute + "/QR/" + mongoose.Types.ObjectId.createFromTime(42))
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Get QR
            await chai
                .request(app)
                .get(mainRoute + "/QR/" + idQR1)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    console.log(res.body.data.address);
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.data.code).to.be.equal("oe");
                });
        });
    });


    describe('Get all QR', function () {
        it('should fail when not logged in or without token', async () => {
            // Get QR
            await chai
                .request(app)
                .get(mainRoute + "/QR/")
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            // Fake token
            let token = "fakeTokenIsNotVeryGentle";

            // Get QR
            await chai
                .request(app)
                .get(mainRoute + "/QR/")
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should work', async () => {
            // Get QR
            await chai
                .request(app)
                .get(mainRoute + "/QR/")
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    res.body.data.forEach((location) => {
                        console.log(location);
                    });
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.results).to.be.equal(2);
                });
        });
    });


    describe('Update QR', function () {
        it('should fail when not logged in or without token', async () => {
            // Update QR
            await chai
                .request(app)
                .patch(mainRoute + "/QR/" + idQR1)
                .send({
                    code: "updatedQRcode"
                })
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            // Fake token
            let token = "fakeTokenIsNotVeryGentle";

            // Update QR
            await chai
                .request(app)
                .patch(mainRoute + "/QR/" + idQR1)
                .send({
                    code: "updatedQRcode"
                })
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with non-admin users', async () => {
            // Update QR
            await chai
                .request(app)
                .patch(mainRoute + "/QR/" + idQR1)
                .send({
                    code: "updatedQRcode"
                })
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fail with invalid id', async () => {
            // Update QR
            await chai
                .request(app)
                .patch(mainRoute + "/QR/" + mongoose.Types.ObjectId.createFromTime(42))
                .send({
                    code: "updatedQRcode"
                })
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Update QR
            await chai
                .request(app)
                .patch(mainRoute + "/QR/" + idQR1)
                .send({
                    code: "updatedQRcode"
                })
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.data.code).to.be.equal("updatedQRcode");
                });
        });
    });


    describe('Delete QR', function () {
        it('should fail when not logged in or without token', async () => {
            // Delete QR
            await chai
                .request(app)
                .delete(mainRoute + "/QR/" + idQR1)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            // Fake token
            let token = "fakeTokenIsNotVeryGentle";

            // Delete QR
            await chai
                .request(app)
                .delete(mainRoute + "/QR/" + idQR1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with non-admin users', async () => {
            // Delete QR
            await chai
                .request(app)
                .delete(mainRoute + "/QR/" + idQR1)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fail with invalid id', async () => {
            // Delete QR
            await chai
                .request(app)
                .delete(mainRoute + "/QR/" + mongoose.Types.ObjectId.createFromTime(42))
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Create QR
            let id = await QR.create({
                code : "WhatAnewCode"
            }).then((doc) => {
                return doc._id
            });

            // Delete previous QR
            await chai
                .request(app)
                .delete(mainRoute + "/QR/" + id)
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(204);
                });

            // Check for the deleted location
            let doc = await QR.findById(id);
            expect(doc).to.be.null;
        });
    });
});


// Remove the user after each test
afterEach(async function () {
    await QR.deleteMany({
        code: "test"
    }).then(() => {
        console.log("Clean QR");
    });
});


// Disconnect the DB at the end
after(async function () {
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.");
    });
});