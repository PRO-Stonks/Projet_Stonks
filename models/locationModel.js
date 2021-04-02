'use strict';
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    address: {
        type: {
            street: {type: String, required: [true, "Please provide a street name"]},
            noStreet: {type: Number, required: [true, "Please provide a street number"]},
            npa: {type: Number, required: [true, "Please provide a NPA"]},
            city: {type: String, required: [true, "Please provide a city name"]},
            country: {type: String, required: [true, "Please provide the country name"]},
        },
        required: [true, "Please provide an address"]
    }
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;