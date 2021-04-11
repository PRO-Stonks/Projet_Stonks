'use strict';
const Element = require('../../models/elementModel');
const Product = require('../../models/productModel');
const QR = require('../../models/QRModel');
const Location = require('../../models/locationModel');
const chai = require('chai');
const mongoose = require('mongoose');
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

})

describe('ElementModel', function () {
    describe('Missing Element', async function () {
        const QR = await QR.create(
            {
                code: "MODEL"
            }
        ).then((data) => {
            return data._id;
        });
        Object.keys(Element.schema.obj).forEach((key) => {
            it('should throws when ' + key + ' is not present', async () => {
                if (Element.schema.obj[key].hasOwnProperty('required')) {
                    let test = {
                        idQR: QR,
                        entryDate: new Date(),
                        price: 10080808,
                        idProduct: await Product.create(
                            {
                                name: "MODEL",
                                tag: "philosophical ignorance"
                            }
                        ).then((data) => {
                            return data._id;
                        }),
                        idLocation: await Location.create(
                            {
                                name: "MODEL",
                                address: {
                                    street: "sirTest",
                                    noStreet: 42,
                                    npa: 95,
                                    city: "Roosevelt",
                                    country: "Moon"
                                }
                            }
                        ).then((data) => {
                            return data._id;
                        })
                    };
                    delete test[key];
                    await expect(Element.create(test)).to.be.rejectedWith(Error);
                }
            });
        });
    });

    describe('Creation', function () {
        it('should create the correct Element', async () => {
            let test = {
                idQR: await QR.create(
                    {
                        code: "MODEL"
                    }
                ).then((data) => {
                    return data._id;
                }),
                entryDate: new Date('2021-04-02'),
                exitDate: new Date ('2021-09-28'),
                price: 10080808,
                idProduct: await Product.create(
                    {
                        name: "MODEL",
                        tag: "philosophical ignorance"
                    }
                ).then((data) => { return data._id; }),
                idLocation: await Location.create(
                    {
                        name: "MODEL",
                        address: {
                            street: "sirTest",
                            noStreet: 42,
                            npa: 95,
                            city: "Roosevelt",
                            country: "Moon"
                        }
                    }
                ).then((data) => {return data._id; })
            };
            await Element.create(test).then((data) => {
                expect(data.entryDate.toDateString()).to.be.equal(new Date('2021-04-02').toDateString());
                expect(data.exitDate.toDateString()).to.be.equal(new Date ('2021-09-28').toDateString());
                expect(data.price).to.be.equal(10080808);
                expect(data.idProduct).to.be.not.empty;
                expect(data.idLocation).to.be.not.empty;
                expect(data.idQR).to.be.not.empty;
                expect(data.active).to.be.true;
            });
        });
    });
});

after( async function () {
     const p = await Promise.all([Element.deleteMany({
            price: 10080808
        }), Product.deleteMany({
            name: "MODEL"
        }),  Location.deleteMany({
            name: "MODEL"
        }),  QR.deleteMany({
            code: "MODEL"
        })]
    );
});
