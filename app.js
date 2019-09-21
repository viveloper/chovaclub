var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var signinRouter = require('./routes/signin');
var boardRouter = require('./routes/board');
var restapiRouter = require('./routes/restapi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//=========================================================
var session = require('express-session');
app.use(session({
  secret: "gholselskgjsidkxlei",
  resave: false,
  saveUninitialized: true
}));

var flash = require('connect-flash');
app.use(flash());

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var passport = require('./modules/passport');
app.use(passport.initialize());
app.use(passport.session());

var engine = require('ejs-mate');
app.engine('ejs', engine);
//=========================================================

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/signin', signinRouter);
app.use('/board', boardRouter);
app.use('/restapi', restapiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
