var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/contact.ajax', (req, res) => {
  const contact = '<a href = "https://myuni.adelaide.edu.au">contact us</a>';
  res.send(contact);
});

router.get('/search.ajax', (req, res) => {
  const search = '<input type = "text" placeholder = "Search"><button>search</button>';
  res.send(search);
});

router.get('/about.ajax', (req, res) => {
  const about = '<input type = "text" placeholder = "about"><button>about</button>';
  res.send(about);
});
module.exports = router;