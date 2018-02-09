var express = require('express');
var router = express.Router();
var userModel = require('../models/user')
var postModel = require('../models/post')
var time = require('time');

/* GET home page. */
router.post('/postpost', function(req, res) {
    console.log('this is the body');
    console.log(req.body);
    var newPost = new postModel({
        user: req.user,
        information: req.body.message,
        date: Date.now(),
    });
    newPost.save(function(err, post){
        if(err) {
            return console.error(err);
        }else {
            console.log(req.user);
            console.log(req.user.tweets);
            userModel.update(
                {handle: req.user.handle}, 
                {
                    "$set": {
                        "handle": 'changed'
                    },
                    $inc: {
                        tweets: 1
                    }
                }
            );
        };
      });
  res.redirect('/' + req.user.handle);
});

module.exports = router;
