'use strict';

const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const app = require("../../app");
const validator = require("validator");
const mongoose = require('mongoose');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require("chai-http"));
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});
const timeoutDuration = 3000;

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
    }).then(() => {
        console.log('DB connection Successfully!');
        mongoose.connection.db.dropDatabase(console.log(`${mongoose.connection.db.databaseName} database dropped.`)
        );
    });

    // Create 2 products
    idProduct1 = await Product.create({
        name: "oe",
        tag: "bad food"
    }).then((res) => {
        return res._id
    });
    idProduct2 = await Product.create({
        name: "eo",
        tag: "healthy food"
    }).then((res) => {
        return res._id
    });
});


describe('productController', function () {
    describe('Add product', function () {
        it('should fails when not logged in or without token', async () => {
            // Add a product
            await chai.request(app)
                .post("/api/v1/products/add")
                .send({
                    name: "test",
                    tag: "junk food"
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fails with invalid token', async () => {
            // Create admin user, log-in and get token
            let token = "fakeTokenIsNotVeryGentle"

            // Add a product
            await chai
                .request(app)
                .post("/api/v1/products/add")
                .set("Authorization", "Bearer " + token)
                .send({
                    name: "test",
                    tag: "junk food"
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                });
        });

        it('should fails as non-admin user', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // Add a product
            await chai
                .request(app)
                .post("/api/v1/products/add")
                .set("Authorization", "Bearer " + token)
                .send({
                    name: "test",
                    tag: "junk food"
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should work as admin', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
                role: "admin"
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // Add a product
            await chai
                .request(app)
                .post("/api/v1/products/add")
                .set("Authorization", "Bearer " + token)
                .send({
                    name: "test",
                    tag: "junk food"
                }).timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(201);
                    expect(res.body.status).to.be.equal('success');
                    expect(validator.isMongoId(res.body.data.doc._id)).to.be.true;
                });
        });
    });


    describe('Get one product', function () {
        it('should fails when not logged in or without token', async () => {
            // Get a product
            await chai
                .request(app)
                .get("/api/v1/products/" + idProduct1)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fails with invalid token', async () => {
            let token = "fakeTokenIsNotVeryGentle";

            // Get a product
            await chai
                .request(app)
                .get("/api/v1/products/" + idProduct1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fails with invalid id', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
                role: "admin"
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // Get a product
            await chai
                .request(app)
                .get("/api/v1/products/" + mongoose.Types.ObjectId.createFromTime(42))
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
                role: "admin"
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // Get a product
            await chai
                .request(app)
                .get("/api/v1/products/" + idProduct1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.data.doc.name).to.be.equal("oe");
                });
        });
    });


    describe('Get all products', function () {
        it('should fails when not logged in or without token', async () => {
            // Get a product
            await chai
                .request(app)
                .get("/api/v1/products/")
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fails with invalid token', async () => {
            let token = "fakeTokenIsNotVeryGentle";

            // Get a product
            await chai
                .request(app)
                .get("/api/v1/products/")
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should work', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
                role: "admin"
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // Get a product
            await chai
                .request(app)
                .get("/api/v1/products/")
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.results).to.be.equal(2);
                    expect(res.body.data.data[0].name).to.be.equal("oe");
                    expect(res.body.data.data[1].name).to.be.equal("eo");
                });
        });
    });


    describe('Update a product', function () {
        it('should fails when not logged in or without token', async () => {
            // Update a product
            await chai
                .request(app)
                .patch("/api/v1/products/" + idProduct1)
                .send({
                    tag: "potatoe"
                })
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fails with invalid token', async () => {
            let token = "fakeTokenIsNotVeryGentle";

            // Update a product
            await chai
                .request(app)
                .patch("/api/v1/products/" + idProduct1)
                .send({
                    tag: "potatoe"
                })
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fails with non-admin users', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // Update a product
            await chai
                .request(app)
                .patch("/api/v1/products/" + idProduct1)
                .send({
                    tag: "fries"
                })
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fails with invalid id', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
                role: "admin"
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // Update a product
            await chai
                .request(app)
                .patch("/api/v1/products/" + mongoose.Types.ObjectId.createFromTime(42))
                .send({
                    tag: "potatoe"
                })
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
                role: "admin"
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // Update a product
            await chai
                .request(app)
                .patch("/api/v1/products/" + idProduct1)
                .send({
                    tag: "potatoe"
                })
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal("success");
                    expect(res.body.data.doc.name).to.be.equal("oe");
                    expect(res.body.data.doc.tag).to.be.equal("potatoe");
                });
        });
    });


    describe('Soft delete a product', function () {
        it('should fails when not logged in or without token', async () => {
            // soft delete a product
            await chai
                .request(app)
                .delete("/api/v1/products/" + idProduct1)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fails with invalid token', async () => {
            let token = "fakeTokenIsNotVeryGentle";

            // soft delete a product
            await chai
                .request(app)
                .delete("/api/v1/products/" + idProduct1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fails with non-admin users', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // soft delete a product
            await chai
                .request(app)
                .delete("/api/v1/products/" + idProduct1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fails with invalid id', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
                role: "admin"
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // soft delete a product
            await chai
                .request(app)
                .delete("/api/v1/products/" + mongoose.Types.ObjectId.createFromTime(42))
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
                role: "admin"
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // Create a Product and softDelete it
            let id = await Product.create({
                name: "test2",
                tag: "real fun"
            }).then((doc) => {
                return doc._id
            });

            await chai
                .request(app)
                .delete("/api/v1/products/" + id)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(204);
                });
        });
    });

    describe('Hard delete a product', function () {
        it('should fails when not logged in or without token', async () => {
            // hard delete a product
            await chai
                .request(app)
                .delete("/api/v1/products/hardDel/" + idProduct1)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(401);
                    expect(res.body.status).to.be.equal('fail');
                });
        });

        it('should fails with invalid token', async () => {
            let token = "fakeTokenIsNotVeryGentle";

            // hard delete a product
            await chai
                .request(app)
                .delete("/api/v1/products/hardDel/" + idProduct1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body)
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                })
        });

        it('should fails with non-admin users', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // hard delete a product
            await chai
                .request(app)
                .delete("/api/v1/products/hardDel/" + idProduct1)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(403);
                    expect(res.body.status).to.be.equal("fail");
                });
        });

        it('should fails with invalid id', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
                role: "admin"
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // hard delete a product
            await chai
                .request(app)
                .delete("/api/v1/products/hardDel/" + mongoose.Types.ObjectId.createFromTime(42))
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(404);
                    expect(res.body.status).to.be.equal("fail");
                    expect(res.body.message).to.be.equal("No document found with that id");
                });
        });

        it('should work with correct id', async () => {
            // Create admin user, log-in and get token
            let token = await User.create({
                firstName: "test",
                lastName: "test",
                email: "email@email.tests",
                password: "012345678",
                role: "admin"
            }).then(() => {
                return chai.request(app)
                    .post("/api/v1/users/login")
                    .send({
                        "email": "email@email.tests",
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

            // Create a Product and softDelete it
            let id = await Product.create({
                name: "test3",
                tag: "real fun"
            }).then((doc) => {
                return doc._id
            });

            await chai
                .request(app)
                .delete("/api/v1/products/hardDel/" + id)
                .set("Authorization", "Bearer " + token)
                .timeout(timeoutDuration)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).to.be.equal(204);
                });
        });
    });
});


// Remove the user after each test
afterEach(async function () {
    await User.remove({
        email: "email@email.tests"
    });
    await Product.remove({
        name: "test"
    });
});

// Disconnect the DB at the end
after(async function () {
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.")
    });
});