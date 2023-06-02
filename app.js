const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const session = require("express-session");


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const mysql = require('mysql2');

// create a 'pool' (group) of connections to be used for connecting with our SQL server
const dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'survival'
});

// Connect to the database
app.use(function (req, res, next) {
    req.pool = dbConnectionPool;
    // eslint-disable-next-line no-console
    console.log("Successful connected to the database");
    next();
});


// Setup session
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'super secret string',
    secure: false
}));

app.use(function(req,res,next){
    // eslint-disable-next-line no-console
    console.log("The current user is:"+req.session.username);
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);



module.exports = app;
