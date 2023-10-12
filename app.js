const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
// todo - add HPP later

const tripRouter = require('./routes/tripRoutes');
const locationRouter = require('./routes/locationRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// configurating PUG view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/', viewRouter);

module.exports = app;
