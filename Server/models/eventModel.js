/**
 * Manage event representation in the db
 * See specs and EA schema for more details
 *
 *
 * These models use discriminator to simulate inheritance
 */
'use strict';
const mongoose = require("mongoose");
const validator = require("validator");

// Base schema
const eventSchema = new mongoose.Schema({
    time: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {discriminatorKey: 'kind'});

const eventConnection = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        validate: [validator.isIP, "IP is invalid"],
        immutable: true
    },
    userAgent: {
        type: String,
        required: true,
        immutable: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    }
});

const eventOrder = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        immutable: true
    }
});

const eventElement = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    element: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Element',
        required: true,
        immutable: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        immutable: true
    },
    change: {
        type: String,
        enum: ["Creation", "Move", "Remove"],
        default: "Creation",
        required: true,
        immutable: true
    },
    oldLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: [
            function () {
                return this.change === "Move";
            },
            "Location is required"
        ],
        validate: {
            validator: function (v) {
                return this.change === "Move";
            },
            message: "Location is not required or bad id given"
        },
        immutable: true
    }
});

const Event = mongoose.model("Event", eventSchema);
const ConnectionEvent = Event.discriminator("ConnectionEvent", eventConnection);
const OrderEvent = Event.discriminator("OrderEvent", eventOrder);
const ElementEvent = Event.discriminator("ElementEvent", eventElement);

module.exports = {
    ConnectionEvent,
    OrderEvent,
    ElementEvent
};