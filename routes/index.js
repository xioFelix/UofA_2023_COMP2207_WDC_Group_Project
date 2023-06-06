const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
var flash = require('connect-flash');

const cookieParser = require('cookie-parser');


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

router.get('/login', function (req, res) {
    if (!req.session.username) {
    req.flash('info', 'Please Login First!');
    res.redirect('http://localhost:8080/Users/userLogin.html');
  }
});


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

      // eslint-disable-next-line no-shadow
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


router.post('/signup', function(req, res, next) {
  try {
    // 验证请求体中的数据是否为空
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.sendStatus(400); // 返回错误状态码，表示请求体数据不完整
      return;
    }

    // 在数据库中查找是否存在相同的用户名
    const query = 'SELECT * FROM user WHERE user_name = ?';
    db.getConnection(function(err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // 处理错误时返回服务器错误状态码
        return;
      }

      connection.query(query, [req.body.username], function(err, results) {
        if (err) {
          console.error(err);
          res.sendStatus(500); // 处理错误时返回服务器错误状态码
          return;
        }

        if (results.length > 0) {
          res.sendStatus(401); // 用户名已存在，返回未授权状态码
        } else {
          // 将新用户插入到数据库中
          const insertQuery = 'INSERT INTO user (user_name, user_email, user_password, user_identity) VALUES (?, ?, ?, ?)';
          connection.query(insertQuery, [req.body.username, req.body.email, req.body.password, "user"], function(err) {
            connection.release(); // 释放连接

            if (err) {
              console.error(err);
              res.sendStatus(500); // 处理错误时返回服务器错误状态码
              return;
            }

            req.session.username = req.body.username;
            console.log(req.body.username);
            res.end();
          });
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // 处理错误时返回服务器错误状态码
  }
});

// 自定义会话验证中间件
function requireSession(req, res, next) {
    if (req.session && req.session.username && req.cookies.auth) {
        // 用户会话和 cookie 都存在，继续处理请求
        next();
    } else {
        // 用户会话或 cookie 不存在，重定向到登录页或其他处理方式
        res.redirect('/login');
    }
}


router.post('/logout', function(req,res,next){

  if ('username' in req.session){
    delete req.session.username;
    res.end();
  } else {
    res.sendStatus(403);
  }

});


router.post('/google_login', async function (req, res) {
  try {
    const { idToken } = req.body; // 获取客户端提供的Google登录令牌

    // 使用 Google OAuth2Client 验证令牌
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: CLIENT_ID // Google客户端ID
    });

    const payload = ticket.getPayload();
    const userEmail = payload.email;

    // 在数据库中检查用户是否存在
    const query = 'SELECT * FROM user WHERE user_email = ?';
    db.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // 处理错误时返回服务器错误状态码
        return;
      }

      connection.query(query, [userEmail], function (err, results) {
        connection.release(); // 释放连接

        if (err) {
          console.error(err);
          res.sendStatus(500); // 处理错误时返回服务器错误状态码
          return;
        }

        const user = results[0];

        if (user) {
          req.session.username = user.user_name;
          console.log(user.user_name);
          res.end();
        } else {
          res.sendStatus(401); // 用户不存在，返回未授权状态码
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // 处理错误时返回服务器错误状态码
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


module.exports = router;
