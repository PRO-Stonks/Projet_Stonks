'use strict';

const Element = require("../../models/elementModel");
const Product = require("../../models/productModel")
const Location = require("../../models/locationModel");
const {ElementEvent} = require("../../models/eventModel");
const QR = require("../../models/QRModel");
const User = require("../../models/userModel");
const app = require("../../app");
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

let idElement1;
let idElement2;
let tokenAdmin;
let tokenManager;
let idLocation1;
let idLocation2;
let idQR1;
let idQR2;
const codeQR1 = "QRcode1";
const codeQR2 = "QRcode2";
const codeQR3 = "QRcode3";
let idProduct;
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

    // Create 2 locations
    idLocation1 = await Location.create({
        name: "oe",
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
        name: "eo",
        address: {
            street: "tseTris",
            noStreet: 24,
            npa: 59,
            city: "tlevesooR",
            country: "nooM"
        }
    }).then((doc) => {
        return doc._id;
    });

    // Create 2 QRcodes
    idQR1 = await QR.create({
        code: codeQR1
    }).then((doc) => {
        return doc._id;
    });
    idQR2 = await QR.create({
        code: codeQR2
    }).then((doc) => {
        return doc._id;
    });
    await QR.create({
        code: codeQR3
    })

    // Create a product
    idProduct = await Product.create({
        name: "pro",
        tag: "bad food"
    }).then((doc) => {
        return doc._id;
    });

    // Create 2 elements
    idElement1 = await Element.create({
        idQR: idQR1,
        entryDate: new Date('2021-04-02'),
        price: 4,
        idProduct: idProduct,
        idLocation: idLocation1
    }).then((doc) => {
        return doc._id;
    });
    idElement2 = await Element.create({
        idQR: idQR1,
        entryDate: new Date('2020-04-02'),
        exitDate: new Date('2021-11-13'),
        price: 2,
        idProduct: idProduct,
        idLocation: idLocation1
    }).then((doc) => {
        return doc._id;
    });
});


describe('elementController', function () {
    describe('Add element', function () {
        it('should fail when not logged in or without token', async () => {
            // Add Element
            await chai.request(app)
                .post(mainRoute + "/elements/add")
                .send({
                    code: codeQR1,
                    entryDate: new Date('2020-01-01'),
                    price: 0,
                    idProduct: idProduct,
                    idLocation: idLocation1
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

            // Add Element
            await chai
                .request(app)
                .post(mainRoute + "/elements/add")
                .set("Authorization", "Bearer " + token)
                .send({
                    code: codeQR1,
                    entryDate: new Date('2020-01-01'),
                    price: 0,
                    idProduct: idProduct,
                    idLocation: idLocation1
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                });
        });

        it('should work', async () => {
            // Add Element
            await chai
                .request(app)
                .post(mainRoute + "/elements/add")
                .set("Authorization", "Bearer " + tokenManager)
                .send({
                    code: codeQR3,
                    entryDate: new Date('2021-04-02'),
                    price: 0,
                    idProduct: idProduct,
                    idLocation: idLocation1
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(201);
                    expect(res.body.status).to.be.equal('success');
                });
            const docs = await ElementEvent.find({}).exec();
            expect(docs.length).to.be.equal(1);
            expect(docs[0].kind).to.be.equal("ElementEvent");
            expect(docs[0].change).to.be.equal('Creation');
            console.log(docs);
        });
    });


    describe('Get element', function () {
        it('should fail when not logged in or without token', async () => {
            // Get Element
            await chai
                .request(app)
                .get(mainRoute + "/elements/" + idElement1)
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

            // Get element
            await chai
                .request(app)
                .get(mainRoute + "/elements/" + idElement1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with invalid id', async () => {
            // Get Element
            await chai
                .request(app)
                .get(mainRoute + "/elements/" + mongoose.Types.ObjectId.createFromTime(42))
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
            // Get Element
            await chai
                .request(app)
                .get(mainRoute + "/elements/" + idElement1)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.data.price).to.be.equal(4);
                });
        });
    });


    describe('Get all elements', function () {
        it('should fail when not logged in or without token', async () => {
            // Get Elements
            await chai
                .request(app)
                .get(mainRoute + "/elements/")
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

            // Get Elements
            await chai
                .request(app)
                .get(mainRoute + "/elements/")
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should work', async () => {
            // Get Elements
            await chai
                .request(app)
                .get(mainRoute + "/elements/")
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    res.body.data.forEach((element) => {
                        console.log(element);
                    });
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.results).to.be.equal(2);
                    expect(res.body.data[0].price).to.be.equal(4);
                    expect(res.body.data[1].price).to.be.equal(2);
                });
        });
    });


    describe('Get all elements in given location', function () {
        it('should fail when not logged in or without token', async () => {
            // Get Elements
            await chai
                .request(app)
                .get(mainRoute + "/elements/local/" + idLocation2 + "/")
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

            // Get Elements
            await chai
                .request(app)
                .get(mainRoute + "/elements/local/" + idLocation2 + "/")
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should work', async () => {
            // Get Elements
            await chai
                .request(app)
                .get(mainRoute + "/elements/local/" + idLocation1 + "/")
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    res.body.data.forEach((element) => {
                        console.log(element);
                    });
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.results).to.be.equal(2);
                });
        });
    });


    describe('Update element', function () {
        it('should fail when not logged in or without token', async () => {
            // Update location
            await chai
                .request(app)
                .patch(mainRoute + "/elements/" + idElement2)
                .send({
                    price: 666
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

            // Update Element
            await chai
                .request(app)
                .patch(mainRoute + "/elements/" + idElement2)
                .send({
                    price: 666
                })
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with invalid id', async () => {
            // Update Element
            await chai
                .request(app)
                .patch(mainRoute + "/elements/" + mongoose.Types.ObjectId.createFromTime(42))
                .send({
                    price: 666
                })
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
            // Update Element
            await chai
                .request(app)
                .patch(mainRoute + "/elements/" + idElement2)
                .send({
                    price: 666
                })
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.data.price).to.be.equal(666);
                });
        });
    });


    describe('Soft delete element', function () {
        it('should fail when not logged in or without token', async () => {
            // Soft delete Element
            await chai
                .request(app)
                .delete(mainRoute + "/elements/" + idElement1)
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

            // Soft delete
            await chai
                .request(app)
                .delete(mainRoute + "/elements/" + idElement1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with invalid id', async () => {
            // Soft delete element
            await chai
                .request(app)
                .delete(mainRoute + "/elements/" + mongoose.Types.ObjectId.createFromTime(42))
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
            // Create Element
            let id = await Element.create({
                idQR: idQR1,
                entryDate: new Date('2021-04-02'),
                price: 98,
                idProduct: idProduct,
                idLocation: idLocation2
            }).then((doc) => {
                return doc._id
            });

            // Delete previous element
            await chai
                .request(app)
                .delete(mainRoute + "/elements/" + id)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(204);
                });

            // Check for the deleted location
            let doc = await Element.findById(id);
            expect(doc).to.be.not.null;
        });
    });


    describe('Hard delete element', function () {
        it('should fail when not logged in or without token', async () => {
            // Delete Element
            await chai
                .request(app)
                .delete(mainRoute + "/elements/hardDel/" + idElement2)
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

            // Hard delete element
            await chai
                .request(app)
                .delete(mainRoute + "/elements/hardDel/" + idElement2)
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
                .delete(mainRoute + "/elements/hardDel/" + idElement2)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fail with invalid id', async () => {
            // Delete element
            await chai
                .request(app)
                .delete(mainRoute + "/elements/hardDel/" + mongoose.Types.ObjectId.createFromTime(42))
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
            // Create Element
            let id = await Element.create({
                idQR: idQR1,
                entryDate: new Date('2021-04-02'),
                price: 98,
                idProduct: idProduct,
                idLocation: idLocation2
            }).then((doc) => {
                return doc._id
            });

            // Delete previous location
            await chai
                .request(app)
                .delete(mainRoute + "/elements/hardDel/" + id)
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(204);
                });

            // Check for the deleted element
            let doc = await Element.findById(id);
            expect(doc).to.be.null;
        });
    });
});


// Remove the user after each test
afterEach(async function () {
    await Element.deleteMany({
        price: 0
    }).then(() => {
        console.log("Clean Element");
    });
});


// Disconnect the DB at the end
after(async function () {
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.");
    });
});