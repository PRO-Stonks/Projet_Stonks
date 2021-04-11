'use strict';

const Location = require("../../models/locationModel");
const User = require("../../models/userModel");
const app = require("../../app");
const validator = require("validator");
const mongoose = require('mongoose');
const mainRoute = "/api/v1";
const {ConnectionEvent} = require("../../models/eventModel");

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
let idAdmin;
let tokenManager;
let idManager;
let idLocation1;
let idLocation2;
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
    });

    // Create manager/admin accounts, log in and get their tokens
    tokenManager = await User.create({
        firstName: "testLocation",
        lastName: "test",
        email: "managerLocation@email.tests",
        password: "012345678",
    }).then(() => {
        console.log("Manager account created");
        return chai.request(app)
            .post(mainRoute + "/users/login")
            .send({
                "email": "managerLocation@email.tests",
                "password": "012345678"
            })
            .timeout(timeoutDuration)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Log in successfully");
                    idManager = res.body.data.user._id;
                    return res.body.token;
                } else {
                    throw "failed to log in";
                }
            });
    });
    tokenAdmin = await User.create({
        firstName: "testLocation",
        lastName: "test",
        email: "adminLocation@email.tests",
        password: "012345678",
        role: "admin"
    }).then(() => {
        console.log("Admin account created");
        return chai.request(app)
            .post(mainRoute + "/users/login")
            .send({
                "email": "adminLocation@email.tests",
                "password": "012345678"
            })
            .timeout(timeoutDuration)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Log in successfully");
                    idAdmin = res.body.data.user._id;
                    return res.body.token;
                } else {
                    throw "failed to log in";
                }
            });
    });

    // Create 2 products
    idLocation1 = await Location.create({
        name: "testLocation",
        address: {
            street: "sirTest",
            noStreet: 42,
            npa: 95,
            city: "Roosevelt",
            country: "Moon"
        }
    }).then((doc) => {
        return doc._id
    });
    idLocation2 = await Location.create({
        name: "testLocation",
        address: {
            street: "tseTris",
            noStreet: 24,
            npa: 59,
            city: "tlevesooR",
            country: "nooM"
        }
    }).then((doc) => {
        return doc._id
    });
});


describe('locationController', function () {
    describe('Add location', function () {
        it('should fail when not logged in or without token', async () => {
            // Add Location
            await chai.request(app)
                .post(mainRoute + "/locations/add")
                .send({
                    name: "testLocationTest",
                    address: {
                        street: "str",
                        noStreet: 0,
                        npa: 0,
                        city: "cty",
                        country: "lnd"
                    }
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

            // Add Location
            await chai
                .request(app)
                .post(mainRoute + "/locations/add")
                .set("Authorization", "Bearer " + token)
                .send({
                    name: "testLocationTest",
                    address: {
                        street: "str",
                        noStreet: 0,
                        npa: 0,
                        city: "cty",
                        country: "lnd"
                    }
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                });
        });

        it('should fail as non-admin user', async () => {
            // Add Location
            await chai
                .request(app)
                .post(mainRoute + "/locations/add")
                .set("Authorization", "Bearer " + tokenManager)
                .send({
                    name: "testLocationTest",
                    address: {
                        street: "str",
                        noStreet: 0,
                        npa: 0,
                        city: "cty",
                        country: "lnd"
                    }
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should work as admin', async () => {
            // Add Location
            await chai
                .request(app)
                .post(mainRoute + "/locations/add")
                .set("Authorization", "Bearer " + tokenAdmin)
                .send({
                    name: "testLocationTest",
                    address: {
                        street: "str",
                        noStreet: 0,
                        npa: 0,
                        city: "cty",
                        country: "lnd"
                    }
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(201);
                    expect(res.body.status).to.be.equal('success');
                    expect(validator.isMongoId(res.body.data._id)).to.be.true;
                });
        });
    });


    describe('Get location', function () {
        it('should fail when not logged in or without token', async () => {
            // Get Location
            await chai
                .request(app)
                .get(mainRoute + "/locations/" + idLocation1)
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

            // Get location
            await chai
                .request(app)
                .get(mainRoute + "/locations/" + idLocation1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with invalid id', async () => {
            // Get Location
            await chai
                .request(app)
                .get(mainRoute + "/locations/" + mongoose.Types.ObjectId.createFromTime(42))
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
            // Get location
            await chai
                .request(app)
                .get(mainRoute + "/locations/" + idLocation1)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    console.log(res.body.data.address);
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.data.name).to.be.equal("testLocation");
                });
        });
    });


    describe('Get all locations', function () {
        it('should fail when not logged in or without token', async () => {
            // Get locations
            await chai
                .request(app)
                .get(mainRoute + "/locations/")
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

            // Get locations
            await chai
                .request(app)
                .get(mainRoute + "/locations/")
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should work', async () => {
            // Get locations
            const prev = await Location.find({}).exec();
            await chai
                .request(app)
                .get(mainRoute + "/locations/")
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    res.body.data.forEach((location) => {
                        console.log(location);
                    });
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.results).to.be.equal(prev.length);
                });
        });
    });


    describe('Update location', function () {
        it('should fail when not logged in or without token', async () => {
            // Update location
            await chai
                .request(app)
                .patch(mainRoute + "/locations/" + idLocation1)
                .send({
                    address: {
                        street: "str",
                        noStreet: 0,
                        npa: 1020,
                        city: "cty",
                        country: "lnd"
                    }
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

            // Update location
            await chai
                .request(app)
                .patch(mainRoute + "/locations/" + idLocation1)
                .send({
                    address: {
                        street: "str",
                        noStreet: 0,
                        npa: 1020,
                        city: "cty",
                        country: "lnd"
                    }
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
            // Update location
            await chai
                .request(app)
                .patch(mainRoute + "/locations/" + idLocation1)
                .send({
                    address: {
                        street: "str",
                        noStreet: 0,
                        npa: 1020,
                        city: "cty",
                        country: "lnd"
                    }
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
            // Update location
            await chai
                .request(app)
                .patch(mainRoute + "/locations/" + mongoose.Types.ObjectId.createFromTime(42))
                .send({
                    address: {
                        street: "str",
                        noStreet: 0,
                        npa: 1020,
                        city: "cty",
                        country: "lnd"
                    }
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
            // Update location
            await chai
                .request(app)
                .patch(mainRoute + "/locations/" + idLocation1)
                .send({
                    address: {
                        street: "str",
                        noStreet: 0,
                        npa: 1020,
                        city: "cty",
                        country: "lnd"
                    }
                })
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.data.name).to.be.equal("testLocation");
                    expect(res.body.data.address.npa).to.be.equal(1020);
                });
        });
    });

    describe('Soft delete Location', function () {
        it('should fail when not logged in or without token', async () => {
            // Soft delete Location
            await chai
                .request(app)
                .delete(mainRoute + "/locations/" + idLocation1)
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

            // Soft delete Location
            await chai
                .request(app)
                .delete(mainRoute + "/locations/" + idLocation1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with non-admin users', async () => {
            // Soft delete Location
            await chai
                .request(app)
                .delete(mainRoute + "/locations/" + idLocation1)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fail with invalid id', async () => {
            // Soft delete Location
            await chai
                .request(app)
                .delete(mainRoute + "/locations/" + mongoose.Types.ObjectId.createFromTime(42))
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
            // Create Location
            let id = await Location.create({
                name: "testLocation",
                address: {
                    street: "zzz",
                    noStreet: 45,
                    npa: 666,
                    city: "tzu",
                    country: "a"
                }
            }).then((doc) => {
                return doc._id
            });

            // Soft delete previous Location
            await chai
                .request(app)
                .delete(mainRoute + "/locations/" + id)
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(204);
                });

            // Check for the soft deleted Product
            let doc = await Location.findById(id);
            expect(doc).to.be.not.null;
        });
    });



    describe('Hard delete Location', function () {
        it('should fail when not logged in or without token', async () => {
            // Delete location
            await chai
                .request(app)
                .delete(mainRoute + "/locations/hardDel/" + idLocation1)
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

            // Delete location
            await chai
                .request(app)
                .delete(mainRoute + "/locations/hardDel/" + idLocation1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with non-admin users', async () => {
            // Delete location
            await chai
                .request(app)
                .delete(mainRoute + "/locations/hardDel/" + idLocation1)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fail with invalid id', async () => {
            // Delete location
            await chai
                .request(app)
                .delete(mainRoute + "/locations/hardDel/" + mongoose.Types.ObjectId.createFromTime(42))
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
            // Create Location
            let id = await Location.create({
                name: "test2",
                address: {
                    street: "zzz",
                    noStreet: 45,
                    npa: 666,
                    city: "tzu",
                    country: "a"
                }
            }).then((doc) => {
                return doc._id
            });

            // Delete previous location
            await chai
                .request(app)
                .delete(mainRoute + "/locations/hardDel/" + id)
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(204);
                });

            // Check for the deleted location
            let doc = await Location.findById(id);
            expect(doc).to.be.null;
        });
    });
});


// Remove the user after each test
afterEach(async function () {
    await Location.deleteMany({
        name: "testLocationTest"
    }).then(() => {
        console.log("Clean location");
    });
});


// Disconnect the DB at the end
after(async function () {
    await User.deleteMany({
        firstName: "testLocation"
    }).then(() => {
        console.log("Clean User in auth");
    });

    await ConnectionEvent.deleteMany({
        user: idAdmin
    }).then(() => {
        console.log("Clean Event");
    });
    await ConnectionEvent.deleteMany({
        user: idManager
    }).then(() => {
        console.log("Clean Event");
    });

    await Location.deleteMany({
        name: "testLocation"
    }).then(() => {
        console.log("Clean Location");
    });
});