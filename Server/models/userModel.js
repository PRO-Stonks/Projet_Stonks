/**
 * Manage User representation in the db
 * See specs and EA schema for more details
 *
 * Password encryption is made with bcrypt (12 rounds)
 */
'use strict';
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please fill your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please fill your last name"],
    },
    email: {
        type: String,
        required: [true, "Please fill your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please fill your password"],
        minLength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "manager"],
        default: "manager",
    },
    active: {
        type: Boolean,
        default: true,
    },
});

userSchema.plugin(uniqueValidator);

// encrypt the password using 'bcryptjs'
// Mongoose -> Document Middleware
// this will be executed after the validator
userSchema.pre("save", async function (next) {
    // check the password if it is modified
    if (!this.isModified("password")) {
        return next();
    }

    // Hashing the password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

/**
 * Verify if the two password are identical
 * @param typedPassword the input password
 * @param originalPassword the password to check against
 * @returns {Promise<*>}
 */
userSchema.methods.correctPassword = async function (
    typedPassword,
    originalPassword,
) {
    return bcrypt.compare(typedPassword, originalPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;