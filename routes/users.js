var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/loginpage', function(req, res, next){
  res.render('loginpage');
});

router.get('/signuppage', function(req, res, next){
  res.render('signuppage');
});
module.exports = router;
