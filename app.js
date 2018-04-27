var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var flash = require('express-flash');
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var db_url = process.env.SHIPPING_DB_URL;

app.use(session({
    secret: 'replace me with long random string',
    resave: true,
    saveUninitialized: true,
    store: new MongoDBStore({uri:db_url})
}));

mongoose.connect(db_url)
    .then( () => {console.log('Connected to mlab'); })
    .catch( () => {console.log('Error connecting to mLab'); })

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Check for invalid ObjectId errors, and respond with 404 error
  if (err.kind === 'ObjectId' && err.name === 'CastError') {
    err.status = 404;
  }

  if (err.status === 404) {
    res.render('404');      // render custom 404 page
  }

  else
    res.status(err.status || 500);
    res.render('error');    // render the error page
});

module.exports = app;
