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

    console.log(database);

    // Connect the database
    await mongoose.connect(database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(con => {
        console.log('DB connection Successfully!');
        mongoose.connection.db.dropDatabase(console.log(`${mongoose.connection.db.databaseName} database dropped.`)
        );
    });

})

describe('ElementModel', function () {
    describe('Missing Element', function () {
        Object.keys(Element.schema.obj).forEach((key) => {
            it('should throws when ' + key + ' is not present', async () => {
                if (Element.schema.obj[key].hasOwnProperty('required')) {
                    let test = {
                        idQR: await QR.create(
                            {
                                code: "megaQRStrin1234"
                            }
                        ).then((data) => {
                            return data._id;
                        }),
                        entryDate: new Date(),
                        price: 10,
                        idProduct: await Product.create(
                            {
                                name: "stonks",
                                tag: "philosophical ignorance"
                            }
                        ).then((data) => {
                            return data._id;
                        }),
                        idLocation: await Location.create(
                            {
                                name: "test",
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
                        code: "megaQRStrin1234"
                    }
                ).then((data) => {
                    return data._id;
                }),
                entryDate: new Date('2021-04-02'),
                exitDate: new Date ('2021-09-28'),
                price: 10,
                idProduct: await Product.create(
                    {
                        name: "stonks",
                        tag: "philosophical ignorance"
                    }
                ).then((data) => { return data._id; }),
                idLocation: await Location.create(
                    {
                        name: "test",
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
                console.log(data);
                expect(data.entryDate.toDateString()).to.be.equal(new Date('2021-04-02').toDateString());
                expect(data.exitDate.toDateString()).to.be.equal(new Date ('2021-09-28').toDateString());
                expect(data.price).to.be.equal(10);
                expect(data.idProduct).to.be.not.empty;
                expect(data.idLocation).to.be.not.empty;
                expect(data.idQR).to.be.not.empty;
                expect(data.active).to.be.true;
            });
        });
    });
});

after(async function(){
    await mongoose.disconnect().then(() => {
        console.log("All connections closed.")
    });
})
