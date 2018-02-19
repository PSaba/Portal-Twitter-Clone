var io = null;
var userModel = require('./models/user');
var sesh = require('./session');
var session = require('client-sessions');
var cookieParser = require('cookie-parser');
var cookietemp = require('cookie');

module.exports = {init: function(server){
        io = require('socket.io')(server);
}, 
login: function(){
    io.on('connection', function(socket){
        console.log('user connected');
        var cookie = socket.request.headers.cookie;
        cookie = cookietemp.parse(cookie);
        var opts = sesh;
        cookie = session.util.decode(opts, cookie.session);
        userModel.findOne({ 
            handle: cookie.content.user.handle}, 
            function(err, user){
                if(err){
                    console.log(err);
                } else {
                    user.following.forEach(element => {
                        console.log(element.handle);
                        socket.join(element.handle);
                    });
                }
            });
        });
}
, instance: function(){ 
        return io}
};
