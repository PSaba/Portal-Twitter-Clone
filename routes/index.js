var express = require('express');
var router = express.Router();
var userModel = require('../models/user')
var postModel = require('../models/post')

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    userModel.find({}, {handle: 1, username: 1, name: 1, _id: 0}, function(err, allUsers){
    postModel.find({}, function(err, postsdone){
    userModel.findOne({handle: req.params.page}, function(err, pagetemp){
      if(pagetemp){
        res.render('index', { title: pagetemp.title, 
          name: pagetemp.name, username: pagetemp.username, handle: pagetemp.handle, tweets: pagetemp.tweets, followers: pagetemp.followers,
          posts: postsdone, following: req.user.following, reqhandle: req.user.handle, potfol: allUsers});
      } else{
        if(err){
          console.log(err);
        }
        res.render('index', { title: 'error', 
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

// router.get('/:page', function(req, res, next) {
//   postModel.find({user: req.user}, function(err, postsdone){
//     userModel.findOne({handle: req.params.page}, function(err, pagetemp){
//       if(pagetemp){
//         res.render('index', { title: pagetemp.title, 
//           name: pagetemp.name, username: pagetemp.username, handle: pagetemp.handle, tweets: pagetemp.tweets, followers: pagetemp.followers,
//           posts: postsdone});
//       } else{
//         if(err){
//           console.log(err);
//         }
//         res.render('index', { title: 'error', 
//           name: 'error', username: 'error', handle: 'error', tweets: 'error', followers: 'error',
//           posts: [{name: "hi", username: "wellthen", date: "July 30", post: "what????", image: "/images/backimg.png"}]});
//       }
//     });
//   });

// });

router.get('/:page', function(req, res) {
  if(req.user){
    userModel.find({}, function(err, allUsers){
    postModel.find({}, function(err, postsdone){
    userModel.findOne({handle: req.params.page}, function(err, pagetemp){
      if(pagetemp){
        res.render('index', { title: pagetemp.title, 
          name: pagetemp.name, username: pagetemp.username, handle: pagetemp.handle, tweets: pagetemp.tweets, followers: pagetemp.followers,
          posts: postsdone, following: req.user.following, reqhandle: req.user.handle, potfol: allUsers});
      } else{
        if(err){
          console.log(err);
        }
        res.render('index', { title: 'error', 
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

module.exports = router;
