const express = require("express");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
// todo - add HPP later

const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
// data sanitizaiton against NoSQL injections
app.use(mongoSanitize());
// data sanitizaiton against XSS
app.use(xss());

module.exports = app;
