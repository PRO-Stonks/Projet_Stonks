'use strict';
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

});

const Event = mongoose.model("Event", userSchema);
module.exports = Event;