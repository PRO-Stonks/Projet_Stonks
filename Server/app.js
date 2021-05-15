/**
 * Define server middleware and routes
 */
'use strict';
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '15kb'
}));

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());


// Routes
app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/locations', require('./routes/locationRoutes'));
app.use('/api/v1/elements', require('./routes/elementRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/events', require('./routes/eventRoutes'));
app.use('/api/v1/QR', require('./routes/QRRoutes'));
app.use('/api/v1/alerts/', require('./routes/alertRoutes'));


// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;