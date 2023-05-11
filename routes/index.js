var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/loginToUser', function (req, res) {
  res.redirect('./Users/user/home_page.html');
});

router.post('/loginToManager', function (req, res) {
  res.redirect('./Managers/manager/home_page.html');
});

router.post('/loginToAdmin', function (req, res) {
  res.redirect('./Admins/Admin/home_page.html');
});

module.exports = router;
