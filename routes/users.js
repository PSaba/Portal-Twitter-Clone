var express = require('express');
var router = express.Router();
userModel = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/loginpage', function(req, res, next){
  res.render('loginpage');
});

router.post('/loggedin', function(req, res, next){
  //console.log(userModel.find());
  console.log(req.body);
  userModel.findOne({ email: req.body.emailusername.trim(), password: req.body.password.trim()}, function(err, user){
    console.log('here');
    if (!user) {
      userModel.findOne({ username: req.body.emailusername.trim(), password: req.body.password.trim()}, function(err, user){
        console.log('here2');
        console.log(user);
        if (!user) {
          res.render('loginpage', { error: 'Invalid email/username or password.' });
        } else {
            req.user = user;
            delete req.user.password; // delete the password from the session
            req.session.user = user;
            res.redirect('/' + user.handle);
        }
      });
    } else {
      console.log(user);
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;
        res.redirect('/' + user.handle);
    }
  });
});
router.get('/signuppage', function(req, res, next){
  res.render('signuppage');
});

router.post('/signedup', function(req, res, next){
  console.log(req.body);
  if(req.body.password1 == req.body.password2){
      var newUser = new userModel({
        name: req.body.name.trim(),
        username: req.body.username.trim(),
        handle: req.body.handle.trim(),
        email: req.body.email.trim(),
        password: req.body.password1.trim(),
        tweets: 0,
        followers: 0
      });
      newUser.save(function(err, page){
        if(err) res.render('signuppage', {error: 'Theres a mistake. Please try again'});
      });
      console.log(req.session);
      res.redirect('/');
  } else{
    res.render('signuppage', {error: 'Passwords dont match'});
  }
});
module.exports = router;
