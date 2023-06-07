var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const socketio= require("socket.io");
var http = require('http');
var app = express();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var playersRouter = require('./routes/players');


const server = http.createServer(app);
const io = socketio(server,{cors:{orgin:"*"}});

var db  = require("./config/connection.js");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
db.connect();
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/players', playersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//----------------------------------------------------------------------

//-----------------------------------------------------------------







// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app:app,server:server,io:io};
