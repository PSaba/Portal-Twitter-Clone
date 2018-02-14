var io = null;
var userModel = require('./models/user');
var sesh = require('./session');
var session = require('client-sessions');
var cookieParser = require('cookie-parser');
var cookietemp = require('cookie');

module.exports = {init: function(server){
        io = require('socket.io')(server);
        io.on('connection', function(socket){
            console.log('a user connected');
        });	
}, instance: function(){ 
        io.on('connection', function(socket){
            var cookie = socket.request.headers.cookie;
            cookie = cookietemp.parse(cookie);
            var opts = sesh;
            cookie = session.util.decode(opts, cookie.session);
                console.log(cookie);
        });	
        return io}
};
