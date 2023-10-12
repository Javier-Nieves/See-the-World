const express = require('express');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
// todo - add HPP later

const tripRouter = require('./routes/tripRoutes');
const locationRouter = require('./routes/locationRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
// data sanitizaiton against NoSQL injections
app.use(mongoSanitize());
// data sanitizaiton against XSS
app.use(xss());

// ROUTES:
app.use('/api/v1/users', userRouter);
app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/locations', locationRouter);

module.exports = app;
