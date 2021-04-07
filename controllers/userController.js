'use strict';
const User = require('../models/userModel');
const base = require('./baseController');

exports.getAllUsers = base.getAll(User);
exports.getUser = base.getOne(User);

// Don't update password on this
exports.updateUser = base.updateOne(User);
exports.deleteUser = base.softDeleteOne(User);

exp