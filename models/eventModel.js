'use strict';
const mongoose = require("mongoose");
const validator = require("validator");

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
        required: true,
        immutable: true
    }
});

const eventOrder = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        immutable: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        immutable: true
    }
});

const eventElement = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        immutable: true
    },
    element: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        immutable: true
    },
    change: {
        type: String,
        enum: ["Creation", "Move", "Remove"],
        default: "Creation",
        immutable: true
    },
    oldLocation: {
        type: mongoose.Schema.Types.ObjectId,
        required: {
            validator: function () {
                return this.change === "Move";
            },
            message: "Location is required"
        },
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