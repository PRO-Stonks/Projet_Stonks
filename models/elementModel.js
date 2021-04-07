'use strict';
const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({

    // mongoose put this as PRIMARY KEY unique and NOT NULL, but i choose here to display a custom message if
    // _id is missing
    _id: {
        type: String, // Assumming that QR codes are strings
        required: [true, "Please use an unique QRCode as _id"]
    },
    entryDate: {
        type: Date,
        required: [true, "Please provide an entry date"]
    },
    exitDate: {
        type: Date,
        //min // searching a way to put exit date >= entryDate
    },
    price: {
        type: Number,
        required: [true, "Please provide a price"],
        min: 0
    },
    idProduct: {    // Foreign key
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, "Please provide a Product id"]
    },
    idLocation: {
        type: mongoose.Types.ObjectId,
        ref: 'Location',
        required: [true, "Please provide a Location id"]
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
});

const Element = mongoose.model("Element", elementSchema);
module.exports = Element;