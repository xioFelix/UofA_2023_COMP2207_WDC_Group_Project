const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const session = require("express-session");
const mysql = require('mysql2');
const { Sequelize, DataTypes } = require('sequelize');
var flash = require('connect-flash');

const app = express();

app.use(cookieParser());
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createPool({
    host: 'localhost',
    database: 'survival'
});

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'survival',
    secure: false
}));

const checkUser = (req, res, next) => {
    if (req.session && req.session.user_name) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.use(function (req, res, next) {
    req.pool = db;
    console.log("Successfully connected to the database");
    next();
});

app.use(function (req, res, next) {
    console.log("The current user is:" + req.session.username);
    next();
});

function requireSession(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.use(function (req, res, next) {
    console.log("The current user is:" + req.session.username);
    next();
});

app.get('/protected/manager/*', checkUser, function (req, res) {
    let url = req.originalUrl;
    res.sendFile(path.join(__dirname, 'protected', url));
});

app.get('/protected/Admin/*', checkUser, function (req, res) {
    let url = req.originalUrl;
    res.sendFile(path.join(__dirname, 'protected', url));
});

app.get('/protected/user/*', checkUser, function (req, res) {
    let url = req.originalUrl;
    res.sendFile(path.join(__dirname, 'protected', url));
});

app.get('/set_google_cookie', (req, res) => {
    res.cookie('google_cookie', 'Hello, Google_Cookie!');
    res.send('Cookie has been set.');
});

app.get('/get_google_cookie', (req, res) => {
    const { google_cookie } = req.session.user_name;
    res.send('Cookie value: ' + google_cookie);
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
