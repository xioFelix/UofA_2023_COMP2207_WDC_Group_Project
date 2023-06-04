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


// 使用cookieParser中间件
app.use(cookieParser());

// 设置全局的cookie属性
app.use((req, res, next) => {
    res.cookie('myCookie', 'Hello, Cookie!', {
        maxAge: 3600000, // 设置过期时间为1小时后
        domain: 'localhost:8080', // 设置作用域为example.com
        path: '/mypath', // 设置路径为/mypath
        secure: false, // 仅在HTTPS连接下发送cookie
        httpOnly: true, // 标记为"HttpOnly"
        sameSite: 'strict' // 设置SameSite属性为"strict"
    });
    next();
});



// 设置cookie
app.get('/set-cookie', (req, res) => {
    // 使用res.cookie()方法设置cookie
    res.cookie('myCookie', 'Hello, Cookie!');
    res.send('Cookie has been set.');
});

// 获取cookie
app.get('/get-cookie', (req, res) => {
    // 通过req.cookies对象获取cookie的值
    const { myCookie } = req.cookies;
    res.send('Cookie value: ' + myCookie);
});


// Setup session
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'survival',
    cookie: { secure: false }
}));

app.use(function(req,res,next){
    // eslint-disable-next-line no-console
    console.log("The current user is:"+req.session.username);
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);



module.exports = app;
