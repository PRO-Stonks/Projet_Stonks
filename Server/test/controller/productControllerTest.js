'use strict';

const Product = require("../../models/productModel");
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
const {ConnectionEvent} = require("../../models/eventModel");
dotenv.config({
    path: './config.env'
});
const timeoutDuration = 3000;

let tokenAdmin;
let idAdmin;
let tokenManager;
let idManager;
let idProduct1;
let idProduct2;
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
        firstName: "testProduct",
        lastName: "test",
        email: "managerProduct@email.tests",
        password: "012345678",
    }).then(() => {
        return chai.request(app)
            .post(mainRoute + "/users/login")
            .send({
                "email": "managerProduct@email.tests",
                "password": "012345678"
            })
            .timeout(timeoutDuration)
            .then((res) => {
                if (res.status === 200) {
                    idManager = res.body.data.user._id;
                    return res.body.token;
                } else {
                    throw "failed to log in";
                }
            });
    });
    tokenAdmin = await User.create({
        firstName: "testProduct",
        lastName: "test",
        email: "adminProduct@email.tests",
        password: "012345678",
        role: "admin"
    }).then(() => {
        return chai.request(app)
            .post(mainRoute + "/users/login")
            .send({
                "email": "adminProduct@email.tests",
                "password": "012345678"
            })
            .timeout(timeoutDuration)
            .then((res) => {
                if (res.status === 200) {
                    idAdmin = res.body.data.user._id;
                    return res.body.token;
                } else {
                    throw "failed to log in";
                }
            });
    });

    // Create 2 products
    idProduct1 = await Product.create({
        name: "testProductA",
        tag: "bad food"
    }).then((res) => {
        return res._id
    });
    idProduct2 = await Product.create({
        name: "testProductA",
        tag: "healthy food"
    }).then((res) => {
        return res._id
    });
});


describe('productController', function () {
    describe('Add product', function () {
        it('should fail when not logged in or without token', async () => {
            // Add product
            await chai.request(app)
                .post(mainRoute + "/products/add")
                .send({
                    name: "testProduct",
                    tag: "junk food"
                }).timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            // Fake token
            let token = "fakeTokenIsNotVeryGentle"

            // Add product
            await chai
                .request(app)
                .post(mainRoute + "/products/add")
                .set("Authorization", "Bearer " + token)
                .send({
                    name: "testProduct",
                    tag: "junk food"
                }).timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                });
        });

        it('should fail as non-admin user', async () => {
            // Add product
            await chai
                .request(app)
                .post(mainRoute + "/products/add")
                .set("Authorization", "Bearer " + tokenManager)
                .send({
                    name: "testProduct",
                    tag: "junk food"
                }).timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should work as admin', async () => {
            // Add product
            await chai
                .request(app)
                .post(mainRoute + "/products/add")
                .set("Authorization", "Bearer " + tokenAdmin)
                .send({
                    name: "testProduct",
                    tag: "junk food"
                }).timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(201);
                    expect(res.body.status).to.be.equal('success');
                    expect(validator.isMongoId(res.body.data._id)).to.be.true;
                });
        });
    });


    describe('Get a product', function () {
        it('should fail when not logged in or without token', async () => {
            // Get product
            await chai
                .request(app)
                .get(mainRoute + "/products/" + idProduct1)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            // Fake token
            let token = "fakeTokenIsNotVeryGentle";

            // Get product
            await chai
                .request(app)
                .get(mainRoute + "/products/" + idProduct1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with invalid id', async () => {
            // Get product
            await chai
                .request(app)
                .get(mainRoute + "/products/" + mongoose.Types.ObjectId.createFromTime(42))
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Get product
            await chai
                .request(app)
                .get(mainRoute + "/products/" + idProduct1)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.data.name).to.be.equal("testProductA");
                });
        });
    });


    describe('Get all products', function () {
        it('should fail when not logged in or without token', async () => {
            // Get products

            await chai
                .request(app)
                .get(mainRoute + "/products/")
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            // Fake token
            let token = "fakeTokenIsNotVeryGentle";

            // Get products
            await chai
                .request(app)
                .get(mainRoute + "/products/")
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should work', async () => {
            // Get products
            const prev = await Product.find({}).exec();
            await chai
                .request(app)
                .get(mainRoute + "/products/")
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.results).to.be.equal(prev.length);
                });
        });
    });


    describe('Update a product', function () {
        it('should fail when not logged in or without token', async () => {
            // Update product
            await chai
                .request(app)
                .patch(mainRoute + "/products/" + idProduct1)
                .send({
                    tag: "potatoe"
                })
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            let token = "fakeTokenIsNotVeryGentle";

            // Update product
            await chai
                .request(app)
                .patch(mainRoute + "/products/" + idProduct1)
                .send({
                    tag: "potatoe"
                })
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with non-admin users', async () => {
            // Update product
            await chai
                .request(app)
                .patch(mainRoute + "/products/" + idProduct1)
                .send({
                    tag: "fries"
                })
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fail with invalid id', async () => {
            // Update product
            await chai
                .request(app)
                .patch(mainRoute + "/products/" + mongoose.Types.ObjectId.createFromTime(42))
                .send({
                    tag: "potatoe"
                })
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Update product
            await chai
                .request(app)
                .patch(mainRoute + "/products/" + idProduct1)
                .send({
                    tag: "potatoe"
                })
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.data.name).to.be.equal("testProductA");
                    expect(res.body.data.tag).to.be.equal("potatoe");
                });
        });
    });


    describe('Soft delete a product', function () {
        it('should fail when not logged in or without token', async () => {
            // Soft delete product
            await chai
                .request(app)
                .delete(mainRoute + "/products/" + idProduct1)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            // Fake token
            let token = "fakeTokenIsNotVeryGentle";

            // Soft delete product
            await chai
                .request(app)
                .delete(mainRoute + "/products/" + idProduct1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with non-admin users', async () => {
            // Soft delete product
            await chai
                .request(app)
                .delete(mainRoute + "/products/" + idProduct1)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fail with invalid id', async () => {
            // Soft delete product
            await chai
                .request(app)
                .delete(mainRoute + "/products/" + mongoose.Types.ObjectId.createFromTime(42))
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Create a product
            let id = await Product.create({
                name: "testProduct",
                tag: "real fun"
            }).then((doc) => {
                return doc._id
            });

            // Soft delete previous product
            await chai
                .request(app)
                .delete(mainRoute + "/products/" + id)
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(204);
                });

            // Check for the soft deleted Product
            let doc = await Product.findById(id);
            expect(doc).to.be.not.null;
        });
    });


    describe('Hard delete a product', function () {
        it('should fail when not logged in or without token', async () => {
            // Hard delete product
            await chai
                .request(app)
                .delete(mainRoute + "/products/hardDel/" + idProduct1)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fail with invalid token', async () => {
            // Fake Token
            let token = "fakeTokenIsNotVeryGentle";

            // Hard delete product
            await chai
                .request(app)
                .delete(mainRoute + "/products/hardDel/" + idProduct1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fail with non-admin users', async () => {
            // Hard delete a product
            await chai
                .request(app)
                .delete(mainRoute + "/products/hardDel/" + idProduct1)
                .set("Authorization", "Bearer " + tokenManager)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fail with invalid id', async () => {
            // Hard delete product
            await chai
                .request(app)
                .delete(mainRoute + "/products/hardDel/" + mongoose.Types.ObjectId.createFromTime(42))
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Create a product
            let id = await Product.create({
                name: "testProduct",
                tag: "real fun"
            }).then((doc) => {
                return doc._id
            });

            // Hard delete previous product
            await chai
                .request(app)
                .delete(mainRoute + "/products/hardDel/" + id)
                .set("Authorization", "Bearer " + tokenAdmin)
                .timeout(timeoutDuration)
                .then((res) => {

                    expect(res.status).to.be.equal(204);
                });

            // Check for the hard deleted Product
            let doc = await Product.findById(id);
            expect(doc).to.be.null;
        });
    });
});


// Remove the user after each test
afterEach(async function () {
    await Product.deleteMany({
        name: "testProduct"
    });
});


after(async function () {
    const q = Promise.all([User.deleteMany({
        firstName: "testProduct"
    }),
        ConnectionEvent.deleteMany({
            user: idAdmin
        }),
        ConnectionEvent.deleteMany({
            user: idManager
        }),
        Product.deleteMany({
            name: "testProductA"
        })]);
});