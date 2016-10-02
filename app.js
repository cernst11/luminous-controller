//Default imports
//
'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var tinycolor = require('tinycolor2');

var router = express.Router();

//light stuff
//var ws281x = require('rpi-ws281x-native');

//effects
var rainbow = require('./effects/rainbow');
var breathe = require('./effects/breathe');
var theaterChase = require('./effects/theaterChase');
var rotate = require('./effects/rotate');
var rawColor = require('./effects/raw');
var color = require('./effects/color');
var power = require('./effects/power');

var colorHelper = require('./helpers/colorHelper').colorHelper;

//scenes
var basicScenes = require('./scenes/basicScenes');

//include routes
var routes = require('./routes/index');
//var users = require('./routes/users');
var app = express();

//include socket stuff
var server = require('http').Server(app);
var io = require('socket.io')(server);

//UDP IMPORT
var UDP_PORT = 6883;
var HOST = server.address.address;
var dgram = require('dgram');
var server_udp = dgram.createSocket('udp4');

var interval;




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
var pixelData = new Uint32Array(NUM_LEDS);
var previousStateArray =  new Uint32Array(NUM_LEDS);

let StripState = require('./helpers/stripState');
let stripState = new StripState.StripState(false, NUM_LEDS, 255, 'off' , 'off', 'stopped');
console.log(stripState);

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
  rawColor.raw(pixelData, message, stripState);
});

//Force the array to emppty on start
let initalColor = 0x000000;
color.setColor(pixelData, initalColor, stripState);

if(initalColor === 0x000000){
  stripState.power = false;
  
}

//rest controller
router.post('/effects', function(req, res) {

  clearInterval(interval);
  stripState.brightness = 255;
  switch (req.body.effect) {
    case 'breathe':
      interval = breathe.startBreathe(interval, stripState, req.body.refresh);
      console.log(interval);
      break;
    case 'rainbow':
      interval = rainbow.startRainbow( pixelData, interval,  stripState, req.body.refresh);
      break;
    case 'theaterChase':
      interval = theaterChase.startTheaterChase( pixelData, req.body.color, interval, req.body.refresh, stripState);
      break;
    case 'rotate':
      interval = rotate.startRotate( pixelData, interval, stripState,  req.body.refresh, req.body.color, req.body.fillColor,  req.body.lit);
      break;
    case 'rawColor':
      rawColor.raw( pixelData, req.body.colorString, stripState);
      break;

  }

  res.json({
    stripState: stripState,
    pixelData: colorHelper.arrayToHexString(pixelData)
  });

}).post('/scene', function(req, res) {
  clearInterval(interval);
  basicScenes.basicScence(pixelData, req.body.scene, req.body.divisions,  stripState, req.body.divisionType);
  res.json({
    stripState: stripState,
    pixelData: colorHelper.arrayToHexString(pixelData)
  });

}).post('/color', function(req, res) {
  clearInterval(interval);
  interval = color.setColor(pixelData, req.body.color, stripState);
  res.json({
    stripState: stripState,
    pixelData: colorHelper.arrayToHexString(pixelData)
  });

}).post('/brightness', function(req, res) {
  stripState.brightness = req.body.brightness;
  res.json({
    stripState: stripState,
    pixelData : colorHelper.arrayToHexString(pixelData)
  });

}).post('/on', function(req, res) {
  clearInterval(interval);
  power.setPower( pixelData, interval, 0xFFFFFF, 'on', stripState, previousStateArray);
  res.json({
    stripState: stripState,
    pixelData: colorHelper.arrayToHexString(pixelData)
  });
}).post('/off', function(req, res) {
    clearInterval(interval);
    var colorArray = power.setPower( pixelData, interval, 0xFFFFFF, 'off', stripState);
    previousStateArray = colorArray.slice(0);
    res.json({
      stripState: stripState,
      pixelData: colorHelper.arrayToHexString(pixelData),
      previousState : previousStateArray
    });
}).post('/toggle', function(req, res) {
    clearInterval(interval);
    if (stripState.power) {
      var colorArray = power.setPower( pixelData, interval, 0xFFFFFF, 'off', stripState);
      previousStateArray = colorArray.slice(0);
    } else {
      power.setPower( pixelData, interval, 0xFFFFFF, 'on', stripState, previousStateArray);
    }
    res.json({
      stripState: stripState,
      pixelData: colorHelper.arrayToHexString(pixelData)
});
});

//stop the the running function
router.get('/stop', function(req, res) {
  clearInterval(interval);
  stripState.setMode('stopped' , 'stopped', 'stopped');
  res.json({
    stripState: stripState,
    pixelData: colorHelper.arrayToHexString(pixelData)
  });
}).get('/off', function(req, res) {
  clearInterval(interval);
  previousStateArray = power.setPower( pixelData, interval, 0xFFFFFF, 'off', stripState);
  res.json({
    stripState: stripState,
    pixelData: colorHelper.arrayToHexString(pixelData),
    previousState : previousStateArray
  });
  //get the current state information for the light
}).get('/state', function(req, res) {

  res.json({
    stripState: stripState,
    pixelData: colorHelper.arrayToHexString(pixelData)
  });
}).get('/on', function(req, res) {
  clearInterval(interval);
  power.setPower( pixelData, interval, 0xFFFFFF, 'on', stripState, previousStateArray);
  res.json({
    stripState: stripState,
    pixelData: colorHelper.arrayToHexString(pixelData)
  });
});


io.on('connection', function(socket) {

  socket.emit('stripProperties', {
    stripState: stripState,
    pixelData: colorHelper.arrayToHexString(pixelData)
  });


  socket.on('changeColor', function(data){
    color.setColor(pixelData, data.color, stripState);
    socket.emit('state', {
      stripState: stripState,
      pixelData: colorHelper.arrayToHexString(pixelData)[0]
    });
  });

  socket.on('changeBrightness', function(data){
    stripState.brightness = data.brightness;
    socket.emit('state', {
      stripState: stripState,
      pixelData: colorHelper.arrayToHexString(pixelData)
    });
  });

  socket.on('getStripProperties', function(data) {
    console.log(data);
    socket.emit('stripState', {
      stripState: stripState,
      pixelData: colorHelper.arrayToHexString(pixelData)
    });

  });

  socket.on('colorStatus', function(data) {
    console.log(data);
    socket.emit('color', {
      pixelData: colorHelper.arrayToHexString(pixelData)
    });

  });


});

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
