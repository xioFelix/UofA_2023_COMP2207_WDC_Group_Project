var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const CLIENT_ID = '646353834079-tcugf0r1sa6bcusb8q7a8g9fl02o7otn.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

router.use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// // 判断登陆中间件
// app.use((req, res, next) => {
//   if (!req.session.user && req.url !== '/login') {
//     res.redirect('/login');
//   } else {
//     next();
//   }
// });

let users = {
  Felix: { password: 'password', email: 'xiofelix725@gmail.com' },
  Emily: { password: 'password', email: 'cyqqazmlp@gmail.com' },
  Lily: { password: 'password', email: 'wangqianying2022@gmail.com' },
  Jancy: { password: 'password', email: '1317858648@qq.com' }
};

router.post('/loginToUser', async function (req, res, next) {

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
    console.log(payload.email);
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    // Search for user by email
    for (let id in users) {
      if (users[id].email === payload.email) {
        req.session.user = users[id];
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
      console.log(req.body.username);
      res.json(req.session.user);
        // Redirect the user to the desired page after login.
      res.redirect('./Users/user/home_page.html');
    } else {
      // No user
      res.sendStatus(401);
    }

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
router.post('/logout', function (req, res, next) {

  if ('username' in req.session) {
    delete req.session.username;
    res.end();
  } else {
    res.sendStatus(403);
  }

});

// // 跳到登录页
// res.redirect('/login');

module.exports = router;
