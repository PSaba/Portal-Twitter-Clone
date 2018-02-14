var express = require('express');
var router = express.Router();
var userModel = require('../models/user')
var postModel = require('../models/post')
var time = require('time');
var io = require('../io');

/* GET home page. */
router.post('/postpost', function(req, res) {
    var newPost = new postModel({
        user: req.user,
        information: req.body.message,
        date: Date.now(),
    });
    var io = require('../io');
    var socket = io.instance();
    socket.emit('postmessage', { user: req.user,
        information: req.body.message,
        date: Date.now(),}); 

    newPost.save(function(err, post){
        if(err) {
            return console.error(err);
        }else {
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
 res.end();
});

module.exports = router;
