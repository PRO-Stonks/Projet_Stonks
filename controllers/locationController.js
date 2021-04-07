'use strict';
const Location = require("../models/locationModel");
const base = require("./baseController");

exports.getLocation = base.getOne(Location);
exports.getAllLocations = base.getAll(Location);

// Admin only
exports.addLocation = base.createOne(Location);
exports.deleteLocation = base.deleteOne(Location);
exports.updateLocation = base.updateOne(Location);