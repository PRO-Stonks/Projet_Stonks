'use strict';

const Element = require("../../models/elementModel");
const Product = require("../../models/productModel")
const Location = require("../../models/locationModel");
const {ElementEvent, ConnectionEvent} = require("../../models/eventModel");
const {ProductAlert} = require('../../models/alertModel');
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
let idAdmin;
let tokenManager;
let idManager;
let idLocation1;
let idQR1;
let idQR2;

const codeQR1 = "QRcode1Alert";
const codeQR2 = "QRcode1Alert2";
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
    });


    // Create manager/admin accounts, log in and get their tokens
    tokenManager = await User.create({
        firstName: "testElement",
        lastName: "test",
        email: "managerAlert@email.tests",
        password: "012345678",
    }).then(() => {
        return chai.request(app)
            .post(mainRoute + "/users/login")
            .send({
                "email": "managerAlert@email.tests",
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
        firstName: "testElement",
        lastName: "test",
        email: "adminAlert@email.tests",
        password: "012345678",
        role: "admin"
    }).then(() => {
        return chai.request(app)
            .post(mainRoute + "/users/login")
            .send({
                "email": "adminAlert@email.tests",
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

    // Create 2 locations
    idLocation1 = await Location.create({
        name: "ElementTest",
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


    // Create a product
    idProduct = await Product.create({
        name: "ElementTest",
        tag: "bad food",
        lowQuantity: 2
    }).then((doc) => {
        return doc._id;
    });

    // Create 2 elements
    idElement1 = await Element.create({
        idQR: idQR1,
        entryDate: new Date('2021-04-02'),
        price: 2,
        idProduct: idProduct,
        idLocation: idLocation1
    }).then((doc) => {
        return doc._id;
    });
    idElement2 = await Element.create({
        idQR: idQR2,
        entryDate: new Date('2021-04-02'),
        price: 2,
        idProduct: idProduct,
        idLocation: idLocation1
    }).then((doc) => {
        return doc._id;
    });

});


describe('Product alert', function () {
    it('should not create an event when not going under the threshold', async () => {
        // Create Element

        // Delete previous element
        await chai
            .request(app)
            .delete(mainRoute +"/elements/QR/" + codeQR1)
            .set("Authorization", "Bearer " + tokenManager)
            .timeout(timeoutDuration)
            .then(async (res) => {
                expect(res.status).to.be.equal(204);
                const alert = await ProductAlert.find({});
                expect(alert.length).to.be.equal(0);
            });
    });
    it('should create an event when going under the threshold', async () => {
        // Create Element

        // Delete previous element
        await chai
            .request(app)
            .delete(mainRoute +"/elements/QR/" + codeQR2)
            .set("Authorization", "Bearer " + tokenManager)
            .timeout(timeoutDuration)
            .then(async (res) => {
                expect(res.status).to.be.equal(204);
                const alert = await ProductAlert.find({});
                expect(alert.length).to.be.equal(1);
            });
    });
    it('Get alert should work', async () => {
        // Create Element

        // Delete previous element
        await chai
            .request(app)
            .get(mainRoute +"/alerts/elements/")
            .set("Authorization", "Bearer " + tokenAdmin)
            .timeout(timeoutDuration)
            .then(async (res) => {
                expect(res.status).to.be.equal(200);
            });
    });

    it('Get alert for product should work', async () => {
        // Create Element

        // Delete previous element
        await chai
            .request(app)
            .get(mainRoute +"/alerts/products/")
            .set("Authorization", "Bearer " + tokenAdmin)
            .timeout(timeoutDuration)
            .then(async (res) => {
                expect(res.status).to.be.equal(200);
            });
    });

});

after(async function () {
    const q = Promise.all([Element.deleteMany({
            idProduct: idProduct
        }), Product.deleteMany({
            name: "ElementTest"
        }), Location.deleteMany({
            name: "ElementTest"
        }), ElementEvent.deleteMany({
            user: idAdmin
        }), ElementEvent.deleteMany({
            user: idManager
        }), ConnectionEvent.deleteMany({
            user: idManager
        }), ConnectionEvent.deleteMany({
            user: idAdmin
        }), User.deleteMany({
            firstName: "testElement"
        }), QR.findByIdAndDelete(idQR1),
        QR.findByIdAndDelete(idQR2),
            ProductAlert.deleteMany({idProduct: idProduct})
        ]
    );
});
