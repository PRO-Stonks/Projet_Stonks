/**
 * File managing user authentication
 */
'use strict';
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const {ConnectionEvent} = require("../models/eventModel");
const AppError = require("../utils/appError");
const base = require("./baseController");

/**
 * Create a JWT token for the user
 * @param id the id of the user
 * @param role the role of the user
 * @returns function to sign the token
 */
const createToken = (id, role) => {
    return jwt.sign(
        {
            id,
            role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        },
    );
};

/**
 * Login behaviour
 * @param req request
 * @param res response
 * @param next handler
 * @returns {Promise<*>}
 */
exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        // 1) check if email and password exist
        if (!email || !password) {
            return next(
                new AppError(404, "fail", "Please provide email or password"),
                req,
                res,
                next,
            );
        }

        // 2) check if user exist and password is correct
        const user = await User.findOne({
            email,
        }).select("+password");

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(
                new AppError(401, "fail", "Email or Password is invalid"),
                req,
                res,
                next,
            );
        }

        await ConnectionEvent.create({
            user: user.id,
            userAgent: req.headers['user-agent'],
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });
        // 3) All correct, send jwt to client
        const token = createToken(user.id, user.role);

        // Remove the password from the output
        user.password = undefined;

        res.status(200).json({
            status: "success",
            token,
            data: {
                user,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new user and hash the password
 * @behaviour hash the password and check data according to specs
 * @param req request
 * @param res response
 * @param next handler
 * @returns {Promise<void>}
 */
exports.signup = async (req, res, next) => {
    try {
        const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
        });
        // We don't return the user password
        user.password = undefined;

        res.status(201).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (err) {
        return base.manageValidationError(err,req,res,next)
    }
};

/**
 * Protection handler
 *
 * @behaviour Restrict access to authenticated user
 * @param req request
 * @param res response
 * @param next handler
 * @returns {Promise<*>}
 */
exports.protect = async (req, res, next) => {
    try {
        // 1) check if the token is there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(
                new AppError(
                    401,
                    "fail",
                    "You are not logged in! Please login in to continue",
                ),
                req,
                res,
                next,
            );
        }

        // 2) Verify token
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) check if the user exist (not deleted)
        const user = await User.findById(decode.id);

        if (!user) {
            return next(
                new AppError(401, "fail", "This user no longer exist"),
                req,
                res,
                next,
            );
        }

        req.user = {id: decode.id, role: decode.role};
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Authorisation handler
 * @behaviour Restrict access to certain user category
 * @param roles
 * @returns {(function(*=, *=, *=): (*|undefined))|*}
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(403, "fail", "You are not allowed to do this action"),
                req,
                res,
                next,
            );
        }
        next();
    };
};