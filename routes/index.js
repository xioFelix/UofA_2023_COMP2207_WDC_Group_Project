var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

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

router.post('/loginToUser', function (req, res, next) {
if ('')

  res.redirect('./Users/user/home_page.html');
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
// req.session.user = null;
// // 跳到登录页
// res.redirect('/login');

module.exports = router;
