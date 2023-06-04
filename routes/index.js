const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express(); // Create an instance of the Express application

const CLIENT_ID = '646353834079-tcugf0r1sa6bcusb8q7a8g9fl02o7otn.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const { get } = require("../app");
const client = new OAuth2Client(CLIENT_ID);

app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: 'localhost',
  database: 'survival'
});

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
  // eslint-disable-next-line no-console
  console.log("Cookies :  ", req.cookies);
});

// ... 省略其余路由处理程序 ...

router.post('/login', async function(req, res, next) {
  try {
    // 验证请求体中的数据是否为空
    if (!req.body.username || !req.body.password) {
      res.sendStatus(400); // 返回错误状态码，表示请求体数据不完整
      return;
    }

    // 在数据库中查找匹配的用户
    const query = 'SELECT * FROM user WHERE user_name = ? AND user_password = ?';
    db.getConnection(function(err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // 处理错误时返回服务器错误状态码
        return;
      }

      connection.query(query, [req.body.username,req.body.password], function(err, results) {
        connection.release(); // 释放连接

        if (err) {
          console.error(err);
          res.sendStatus(500); // 处理错误时返回服务器错误状态码
          return;
        }

        const user = results[0];

        if (user && user.user_password === req.body.password) {
          req.session.username = user.user_name;
          console.log(user.user_name);
          res.end();
        } else {
          res.sendStatus(401); // 用户名或密码不正确，返回未授权状态码
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // 处理错误时返回服务器错误状态码
  }
});


router.post('/signup', function(req,res,next){

  if (req.body.username in users){
    res.sendStatus(401);
  } else {
    req.session.username = req.body.username;
    users[req.body.username] = { password: req.body.password };
    console.log(req.body.username);
    res.end();
  }

});

router.post('/logout', function(req,res,next){

  if ('username' in req.session){
    delete req.session.username;
    res.end();
  } else {
    res.sendStatus(403);
  }

});


router.post('/login_to_user_by_google', async function (req, res) {
  // This code handles a Google login via an AJAX request to the regular login route
  if ('client_id' in req.body && 'credential' in req.body) {

    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // console.log(payload['sub']);
    // eslint-disable-next-line no-console
    console.log(payload.email);
    req.cookies.set("email", payload.email);
    // eslint-disable-next-line
    console.log(payload.given_name);
    // res.redirect('./Users/user/home_page.html');
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    // Search for user by email
    for (let id in users) {
      if (users[id].email === payload.email) {
        req.session.user = users[id];
        res.cookie("auth",true);
        console.log("Login in by user name successfully");
        res.redirect('/Users/user/home_page.html');
        res.json(req.session.user);
        return;
      }
    }

    // No user
    res.sendStatus(401);


  } else if ('username' in req.body && 'password' in req.body) {

    if (req.body.username in users && users[req.body.username].password === req.body.password) {
      // There is a user
      req.session.user = users[req.body.username];
      // eslint-disable-next-line no-console
      console.log(req.body.username);
      res.json(req.session.user);
      // Redirect the user to the desired page after login.
      // res.redirect('./Users/user/home_page.html');
    } else {
      // No user
      res.sendStatus(401);
    }

  } else {
    res.sendStatus(401);
  }
});

router.post('/loginToManager', function (req, res) {
  res.redirect('./Managers/manager/home_page.html');
});

router.post('/loginToAdmin', function (req, res) {
  res.redirect('./Admins/Admin/home_page.html');
});

router.post('/otherLoginToUser', function (req, res) {
  res.redirect('./Users/user/home_page.html');
});

router.get('/cookie',function(req, res){
  res.cookie(cookie_name , 'cookie_value', { expire: new Date() + 9000000 }).send('Cookie is set');
});

// // 登录功能 待实现
// router.findUser(username, password, result => {
//   if (result.length > 0) {
//     // 登录成功
//     // 登录成功了，把当前用户的信息，保存到req.session中
//     req.session.user = req.body;
//     res.redirect('/');
//   } else {
//     res.redirect('/login');
//   }
// });

// // 退出登录功能 待实现
router.get('/clearcookie', function(req,res){
  clearCookie('cookie_name');
  res.send('Cookie deleted');
  // 跳到登录页
  res.redirect('/login');
});



module.exports = router;
