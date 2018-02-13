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
  userModel.findOne({ email: req.body.emailusername.trim(), password: req.body.password.trim()}, function(err, user){
    if (!user) {
      userModel.findOne({ username: req.body.emailusername.trim(), password: req.body.password.trim()}, function(err, user){
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
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;
        res.redirect('/' + user.handle);
    }
  });
  console.log(req.user);
});

router.get('/profilepage', function(req, res, next){
  userModel.find({}, function(err, allUsers){
  postModel.find({user: req.user}, function(err, postsdone){
    userModel.findOne({handle: req.params.page}, function(err, pagetemp){
      if(pagetemp){
        res.render('profile', { title: pagetemp.title, 
          name: pagetemp.name, username: pagetemp.username, handle: pagetemp.handle, tweets: pagetemp.tweets, followers: pagetemp.followers,
          followpot: allUsers, following: pagetemp.user.following, posts: postsdone});
      } else{
        if(err){
          console.log(err);
        }
        res.render('profile', { title: 'error', 
          name: 'error', username: 'error', handle: 'error', tweets: 'error', followers: 'error',
          posts: [{name: "hi", username: "wellthen", date: "July 30", post: "what????", image: "/images/backimg.png"}]});
      }
    });
  });
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
        followers: new Array(),
        following: new Array(),
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
