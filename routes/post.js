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
    // socket.emit('postmessage', { user: req.user,
    //     information: req.body.message,
    //     date: Date.now(),}); 
   // console.log(req.user.handle);
    socket.to(req.user.handle).emit('postmessage', {message: req.body.message, user: req.user, time: Date.now()});
    // io.on('connection', function(socket){
    //     socket.on(req.user.handle, function(id, msg){
    //         socket.broadcas.to(id).emit({message: req.body.message, user: req.user, time: Date.now() }, msg);
    //     });
    // })
    console.log('sent');

    newPost.save(function(err, post){
        if(err) {
            return console.error(err);
        }else {
            userModel.update(
                {handle: req.user.handle}, 
                {
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
