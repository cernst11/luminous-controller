//Default imports
'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const spdy = require('spdy');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('config');

const router = express.Router();

//effects
const rawColor = require('./effects/raw');
const color = require('./effects/color');

const app = express();





const networkConfig = config.get('serverProperties.networkConfiguration');

//include socket stuff
const server = require('http').Server(app);
// const io = require('socket.io')(server);

//UDP IMPORT
const UDP_PORT = networkConfig.udp_port;
const HOST = server.address.address;
const dgram = require('dgram');
const server_udp = dgram.createSocket('udp4');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //res.io = io;
  next();
});

server_udp.bind(UDP_PORT, HOST);

//set up and intialize the pixels



//when support comes for multiple outs they will be saved in a db
const stripConfig = config.get('serverProperties.stripProperties');
console.log(stripConfig);
const StripState = require('./helpers/stripState');
const stripState = new StripState.StripState(false, stripConfig.num_leds,  255, 'off' , 'off', 'stopped' , stripConfig.location, stripConfig.strandType);


let previousState= {};
let previousStateArray =  new Uint32Array(stripConfig.num_leds);
previousState.previousStateArray = previousStateArray;

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
  const address = server.address();
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

// io.on('connection', function(socket) {

//   socket.emit('stripProperties', {
//     stripState: stripState,
//   });

//   socket.on('changeColor', function(data){
//     clearInterval(stripState.interval);
//     color.setColor( data.color, stripState);
//     socket.emit('state', {
//       stripState: stripState,
//     });
//   });

//   socket.on('changeBrightness', function(data){
//     stripState.brightness = data.brightness;
//     socket.emit('state', {
//       stripState: stripState,
//     });
//   });

//   socket.on('getStripProperties', function(data) {
//     console.log(data);
//     socket.emit('stripState', {
//       stripState: stripState,
//     });

//   });

//   socket.on('colorStatus', function(data) {
//     console.log(data);
//     socket.emit('color', {
//     });

//   });

//   socket.on('rawColor', function(data) {
//     rawColor.raw( data.message, stripState);
//     socket.emit('color', {
//       stripState: stripState
//     });

//   });

// });

//include routes
const powerRoute = require('./routes/power');
const effects = require('./routes/effects');
const routes = require('./routes/index');
const brightness = require('./routes/brightness');
const colorRoute = require('./routes/color');
const state = require('./routes/state');
const scene = require('./routes/scene');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//add routes to apps
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/dist')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/mode', router);
app.use('/', routes);
app.use('/api/power', powerRoute);
app.use('/api/effects', effects);
app.use('/api/brightness', brightness);
app.use('/api/color', colorRoute);
app.use('/api/state', state);
app.use('/api/scene', scene);

//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
