const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// eslint-disable-next-line no-unused-vars
const session = require('express-session');
// eslint-disable-next-line no-unused-vars
require('connect-flash');
// eslint-disable-next-line no-unused-vars
const cookieParser = require('cookie-parser');
const app = express();
const CLIENT_ID = '646353834079-tcugf0r1sa6bcusb8q7a8g9fl02o7otn.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const { join } = require("path");
const client = new OAuth2Client(CLIENT_ID);
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: 'localhost',
  database: 'survival'
});

router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
  console.log("Cookies :  ", req.cookies);
});

router.get('/login', function (req, res) {
  console.log(req.session.username);
  if (req.session.username === null || req.session.username === '') {
    req.flash('info', 'Please Login First!');
    res.redirect('/Users/userLogin.html');
  }else{
    res.redirect('../protected/user/home_page.html');

  }
});

router.post('/login', async function (req, res, next) {
  try {
    // 验证请求体中的数据是否为空
    if (!req.body.user_email || !req.body.password) {
      res.sendStatus(400); // 返回错误状态码，表示请求体数据不完整
      return;
    }

    // 在数据库中查找匹配的用户，同时获取用户身份
    const query = 'SELECT user_id, user_name, user_email, user_password, user_identity FROM user WHERE user_email = ? AND user_password = ?';
    db.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // 处理错误时返回服务器错误状态码
        return;
      }

      // eslint-disable-next-line no-shadow
      connection.query(query, [req.body.user_email, req.body.password], function (err, results) {
        connection.release(); // 释放连接
        if (err) {
          console.error(err);
          res.sendStatus(500); // 处理错误时返回服务器错误状态码
          return;
        }

        let user;
        if (results.length > 0) {

          // eslint-disable-next-line prefer-destructuring
          user = results[0];
        } else {
          console.log('No results found');
        }

        if (user) {
          console.log(user.name);
        }

        if (user.user_password === req.body.password) {
          req.session.username = user.user_name;
          req.session.userId = user.user_id;
          req.session.userEmail = user.user_email;
          req.session.userIdentity = user.user_identity;
          console.log("The current user is2: " + req.session.username);
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

router.get('/get_user_info', function (req, res, next) {
  res.json({
    username: req.session.username,
    userId: req.session.userId,
    email: req.session.userEmail
   });
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

      connection.query(query, [req.body.username], function(err1, results) {
        if (err1) {
          console.error(err1);
          res.sendStatus(500); // 处理错误时返回服务器错误状态码
          return;
        }

        if (results.length > 0) {
          res.sendStatus(401); // 用户名已存在，返回未授权状态码
        } else {
          // 将新用户插入到数据库中
          const insertQuery = 'INSERT INTO user (user_name, user_email, user_password, user_identity) VALUES (?, ?, ?, ?)';
          connection.query(insertQuery, [req.body.username, req.body.email, req.body.password, "user"], function(err2) {
            connection.release(); // 释放连接

            if (err2) {
              console.error(err2);
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



router.get('/logout', function(req, res, next) {
  if ('username' in req.session) {
    delete req.session.username;
    res.redirect('/protected/user/userLogin.html');
    console.log("The current user is:"+req.session.username);
  } else {
    res.sendStatus(403);
    console.log("The current user is:"+req.session.username);
  }
});

router.post('/loginToManager', function (req, res) {
  res.redirect('/protected/manager/home_page.html');
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

      // eslint-disable-next-line no-shadow
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

function checkAuth(req, res, next) {
  if (!req.session.username) {
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
}

app.use('/protected', checkAuth);

app.get('/protected/user/home_page.html', function (req, res) {
  res.sendFile(join(__dirname, 'user', 'home_page.html'));
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

      // post annoucenment
      // Route for retrieving activitys from the database
      router.get('/posts', function (req, res) {

        // Connect to the database
        req.pool.getConnection(function (err, connection) {
          if (err) {
            res.sendStatus(500);
            return;
          }
          var query = "SELECT * FROM activity;";
          connection.query(query, function (err3, rows, fields) {
            connection.release();
            if (err3) {
              res.sendStatus(500);
              return;
            }
            res.json(rows); // send response
          });
        });
      });

      // Route for adding an activity to the database
      router.post('/posts', (req, res) => {
        const { clubID } = req.body;
        const { title } = req.body;
        const { content } = req.body;

        // Check if club ID exists in the database
        req.pool.getConnection((err, connection) => {
          if (err) {
            res.sendStatus(500);
            return;
          }

          const query = 'SELECT * FROM activity WHERE club_id = ?';
          connection.query(query, [clubID], (err2, rows) => {
            if (err2) {
              res.sendStatus(500);
              connection.release();
              return;
            }

            if (rows.length === 0) {
              res.status(400).json({ error: 'Club ID does not exist in the database.' });
              connection.release();
              return;
            }

            // Club ID exists, proceed with inserting the post
            const insertQuery = 'INSERT INTO activity (club_id, announcement_title, announcement_content) VALUES (?, ?, ?)';
            connection.query(insertQuery, [clubID, title, content], (err3, result) => {
              connection.release();
              if (err3) {
                res.sendStatus(500);
                return;
              }

              res.sendStatus(200);
            });
          });
        });
      });

      // setting
      router.post('/personal_info', function (req, res, next) {

  try {
    // 验证请求体中的数据是否为空
    if (!req.body.username || !req.body.password) {
      res.sendStatus(400); // 返回错误状态码，表示请求体数据不完整
      return;
    }

    // 更新用户密码
    const updateQuery = 'UPDATE user SET user_password = ? WHERE user_name = ?';
    db.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // 处理错误时返回服务器错误状态码
        return;
      }

      // eslint-disable-next-line no-shadow
      connection.query(updateQuery, [req.body.password, req.body.username], function (err) {
        connection.release(); // 释放连接

        if (err) {
          console.error(err);
          res.sendStatus(500); // 处理错误时返回服务器错误状态码
          return;
        }

        req.session.username = req.body.username;
        console.log("Successful update the password of" + req.body.username);
        res.end();
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // 处理错误时返回服务器错误状态码
  }
});

router.get('/personal_info', function (req, res) {
  // 从数据库中获取当前用户的信息
  db.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500); // 处理错误时返回服务器错误状态码
      return;
    }
    var query = 'SELECT * FROM user WHERE user_name = ?'; // 假设你有一个名为 'user' 的表格，并且有一个名为 'id' 的字段用于标识用户
    // eslint-disable-next-line no-shadow
    connection.query(query, function (err, results) { // 假设你已经从请求中获取了当前用户的ID，并将其赋值给变量 currentUserId
      connection.release(); // 释放连接
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});


module.exports = router;
