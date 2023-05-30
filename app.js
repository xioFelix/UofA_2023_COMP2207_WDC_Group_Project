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

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(session({
    // 给cookie中存储的sessionid加密的， 可以随意指定一个字符串
    secret: 'itcast',
    // 设置浏览器端cookie中的sessionId设置名字， 默认connect.sid
    name: 'sessionId',
    resave: false,
    // 在浏览器和服务器连接的第一时间，分配session  给浏览器指定一个cookie
    saveUninitialized: true
}));

module.exports = app;
