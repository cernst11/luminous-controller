//Default imports
'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var router = express.Router();

//effects
var rawColor = require('./effects/raw');
var color = require('./effects/color');

var app = express();


//include socket stuff
var server = require('http').Server(app);
var io = require('socket.io')(server);

//UDP IMPORT
var UDP_PORT = 6883;
var HOST = server.address.address;
var dgram = require('dgram');
var server_udp = dgram.createSocket('udp4');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.io = io;
  next();
});

server_udp.bind(UDP_PORT, HOST);

//set up and intialize the pixels
var NUM_LEDS = parseInt(process.argv[2], 60) || 60 ;
var previousState= {};
var previousStateArray =  new Uint32Array(NUM_LEDS);
previousState.previousStateArray = previousStateArray;

let StripState = require('./helpers/stripState');
let stripState = new StripState.StripState(false, NUM_LEDS, 255, 'off' , 'off', 'stopped');

//pass the strip and previous state as global array
app.set('stripState', stripState);
app.set('previousStateArray', previousStateArray);

//ws281x.init(stripState.numLEDS);

process.on('SIGINT', function() {
  stripState.reset();
  //ws281x.reset();
  process.nextTick(function() {
    process.exit(0);
  });
});


//UDP listener
server_udp.on('listening', function() {
  var address = server.address();
  console.log(address);
});

server_udp.on('message', function(message, remote) {
  console.log(remote);
  rawColor.raw(message, stripState);
});

//Force the array to emppty on start
let initalColor = 0xFFFFFF;
color.setColor(initalColor, stripState);

if(initalColor === 0x000000){
  stripState.power = false;
  stripState.setMode('off', 'off', 'stopped');

}

io.on('connection', function(socket) {

  socket.emit('stripProperties', {
    stripState: stripState,
  });

  socket.on('changeColor', function(data){
    color.setColor( data.color, stripState);
    socket.emit('state', {
      stripState: stripState,
    });
  });

  socket.on('changeBrightness', function(data){
    stripState.brightness = data.brightness;
    socket.emit('state', {
      stripState: stripState,
    });
  });

  socket.on('getStripProperties', function(data) {
    console.log(data);
    socket.emit('stripState', {
      stripState: stripState,
    });

  });

  socket.on('colorStatus', function(data) {
    console.log(data);
    socket.emit('color', {
    });

  });

  socket.on('rawColor', function(data) {
    rawColor.raw( data.message, stripState);
    socket.emit('color', {
      stripState: stripState
    });

  });

});

//include routes
var powerRoute = require('./routes/power');
var effects = require('./routes/effects');
var routes = require('./routes/index');
var brightness = require('./routes/brightness');
var color = require('./routes/color');
var state = require('./routes/state');
var scene = require('./routes/scene');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/dist')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/mode', router);
app.use('/', routes);
app.use('/api/power', powerRoute);
app.use('/api/effects', effects);
app.use('/api/brightness', brightness);
app.use('/api/color', color);
app.use('/api/state', state);
app.use('/api/scene', scene);

//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
  res.status(500).json({message: err.message,   error: err });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
 res.status(500).json({message: err.message,   error: err });
});




module.exports = {
  app: app,
  server: server
};
