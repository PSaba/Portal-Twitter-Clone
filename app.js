var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('client-sessions');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/post');

var app = express();


//cors
app.use(cors())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "http://localhost:2500/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  
  next();
});

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
  
})

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})




var session1 = require('./session');
//check user session
app.use(session(session1));


app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    userModel.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) { //USER VS USER SESSION!!!!!
        req.user = user.toObject();
        req.session.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});


//logout
app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/auth/getRegister');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function requireLogin (req, res, next) {
  if (!req.session.user) {
    res.redirect('/users/loginpage');
  } else {
    next();
  }
}; 

app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);

mongoose.connect('mongodb://localhost/feb2018');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('CONNECTED TO MONGO');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
