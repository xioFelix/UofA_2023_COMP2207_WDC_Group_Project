const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const session = require("express-session");
const mysql = require('mysql2');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// create a 'pool' (group) of connections to be used for connecting with our SQL server
const db = mysql.createPool({
    host: 'localhost',
    database: 'survival'
});

// Connect to the database
app.use(function (req, res, next) {
    req.pool = db;
    // eslint-disable-next-line no-console
    console.log("Successfully connected to the database");
    next();
});

// 使用cookieParser中间件
app.use(cookieParser());

// // cookies配置
// app.use((req, res, next) => {
//     // 向请求体对象中新加一个cookies属性，对应当前请求，相应
//     req.cookies = new Cookies(req, res);
//     // 给req对象增加一个用户信息的属性，以便所有路由都能读取
//     req.userInfo = {};
//     // 如果客户端中有cookie信息
//     if (req.cookies.get("userInfo")) {
//         // 将其解析后存入req.userInfo中
//         req.userInfo = JSON.parse(req.cookies.get("userInfo"));
//         // 根据用户id从数据库中查询出当前登录用户的信息
//         userModel.findById(req.userInfo.userid).then((user) => {
//             // 以此判断当前用户是否为管理员
//             req.userInfo.isadmin = user.isadmin;
//             next();
//         });
//
//     } else {
//         // 继续下一个中间件
//         next();
//     }
// });

// cookies配置
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'super secret string',
    secure: false
}));

app.use(function(req,res,next){
    console.log("The current user is:"+req.session.username);
    next();
});

// 自定义会话验证中间件
function requireSession(req, res, next) {
    if (req.session && req.session.username) {
        // 用户会话存在，继续处理请求
        next();
    } else {
        // 用户会话不存在，重定向到登录页或其他处理方式
        res.redirect('/login');
    }
}

// 设置cookie
app.get('/set_google_cookie', (req, res) => {
    // 使用res.cookie()方法设置cookie
    res.cookie('google_cookie', 'Hello, Google_Cookie!');
    res.send('Cookie has been set.');
});

// 获取cookie
app.get('/get_google_cookie', (req, res) => {
    // 通过req.cookies对象获取cookie的值
    const { google_cookie } = req.cookies;
    res.send('Cookie value: ' + google_cookie);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);



module.exports = app;
