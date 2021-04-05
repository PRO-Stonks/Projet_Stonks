'use strict';
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const eventSchema = new mongoose.Schema({
    time: {
        type: Date,
        default: Date.now
    }
}, {discriminatorKey: 'kind'});



const Event = mongoose.model("Event", eventSchema);
module.exports = Event;