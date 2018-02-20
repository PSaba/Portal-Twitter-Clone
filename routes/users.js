var express = require('express');
var router = express.Router();
userModel = require('../models/user');
var postModel = require('../models/post');
var bcrypt = require('bcrypt');
var io = require('../io');

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
  var handle;
  
  userModel.findOne({ email: req.body.emailusername.trim()}, function(err, user){
      if (!user) {
        userModel.findOne({ username: req.body.emailusername.trim()}, function(err, user){
        if (user) {
            bcrypt.compare(req.body.password, user.password, function(err, rest) {
              if(rest){
                req.user = user;
                delete req.user.password; // delete the password from the session
                req.session.user = user;
                handle = user.handle;
                io.login();
                res.redirect('/' + user.handle);
              } else {
                res.render('loginpage', { error: 'Invalid username/password combination'});
              }
            });

          } else {
            res.render('loginpage', { error: 'Invalid username/password combination'});
          }
        });   
    } else {
      bcrypt.compare(req.body.password, user.password, function(err, rest) {
        if(rest){
          req.user = user;
          delete req.user.password; // delete the password from the session
          req.session.user = user;
          handle = user.handle;
          res.redirect('/' + user.handle);
          io.login();
        } 
        else {
          res.render('loginpage', { error: 'Invalid username/password combination'});
        }
      });
    }
  });
});

router.get('/profilepage/:page', function(req, res){
  if(req.user){
      userModel.find({}, {handle: 1, username: 1, name: 1, _id: 0}, function(err, allUsers){
    userModel.findOne({handle: req.params.page}, function(err, pagetemp){
  postModel.find({}, function(err, postsdone){
      if(pagetemp){
        res.render('profile', { title: pagetemp.title, 
          name: pagetemp.name, username: pagetemp.username, handle: pagetemp.handle, tweets: pagetemp.tweets, followers: pagetemp.followers,
          followpot: allUsers, following: pagetemp.following, posts: postsdone, reqHandle: req.user.handle});
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
  } else{
    res.redirect('/users/loginpage');
  }


});

router.get('/signuppage', function(req, res, next){
  res.render('signuppage');
});

const saltRounds = 10;
router.post('/signedup', function(req, res, next){
  if(req.body.password1 == req.body.password2){
    bcrypt.hash(req.body.password1, saltRounds, function(err, hash) {
        var newUser = new userModel({
        name: req.body.name.trim(),
        username: req.body.username.trim(),
        handle: req.body.handle.trim(),
        email: req.body.email.trim(),
        password: hash,
        tweets: 0,
        followers: new Array(),
        following: new Array(),
      });
      newUser.save(function(err, page){
        if(err) {
          res.render('signuppage', {error: 'Theres a mistake. Please try again'});
        }
        else {res.redirect('/' + req.body.handle.trim());}
    });});
  } else{
    res.render('signuppage', {error: 'Passwords dont match'});
  }
});

router.get('/addfollower/:page', function(req, res){
  var updateTo;
  console.log('adding follower');
  userModel.findOne({handle: req.params.page}, function(err, person){
    updateTo = req.user.following.push(person);
  userModel.findOneAndUpdate({handle: req.user.handle}, 
    {
      $addToSet: {
        following: {
          handle: person.handle,
          username: person.username,
          name: person.name
        }
      }
    }, function(err, page){
      console.log(page);
      io.instance().on('connection', function(err, socket){
        socket.join(person.handle);
      })
    }
  )
});
  res.send('added follower');
  });

  router.get('/removefollower/:page', function(req, res){
    var updateTo;
    console.log('removing follower');
    userModel.findOne({handle: req.params.page}, function(err, person){
      updateTo = req.user.following.push(person);
    userModel.findOneAndUpdate({handle: req.user.handle}, 
      {
        $pull: {
          following: {
            handle: person.handle,
          }
        }
      }, function(err, person){
        console.log(person);
        io.instance().on('connection', function(err, socket){
          socket.leave(person.handle);
        })
      }
    )
  });
  res.send('removed follower');
    });

module.exports = router;
