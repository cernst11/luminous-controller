//Default imports
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var tinycolor = require("tinycolor2");

var router = express.Router();

var ws281x = require('rpi-ws281x-native');
var color = require('./effects/color');

//effects
var rainbow = require('./effects/rainbow');
var breathe = require('./effects/breathe');
var theaterChase = require('./effects/theaterChase');
var rotate = require('./effects/rotate');
var rawColor = require('./effects/raw');

//scenes
var basicScenes = require('./scenes/basicScenes');

//include routes
var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

//include socket stuff
var server = require('http').Server(app);
var io = require('socket.io')(server);


//Stip States
var interval;

var stripState ={
    state: 'stopped',
    power: false,
    brightness: 255
};


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.io = io;
    next();
});

//set up and intialize the pixels
var NUM_LEDS = parseInt(process.argv[2], 220) || 220,
    pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);


process.on('SIGINT', function () {
    ws281x.reset();
    process.nextTick(function () {
        process.exit(0);
    });
});

var currentMode;
//rest controller
router.post('/effects', function (req, res) {

    clearInterval(interval);
    console.log(req.body);


    switch (req.body.effect) {
        case 'breathe':
            interval = breathe.startBreathe(ws281x, interval, req.body.refresh, stripState);
            console.log(interval);
            break;
        case 'rainbow' :
            interval = rainbow.startRainbow( NUM_LEDS, pixelData,  ws281x, interval, req.body.refresh, stripState);
            break;
        case 'theaterChase' :
            interval = theaterChase.startTheaterChase( NUM_LEDS, pixelData,  ws281x, req.body.color , interval, req.body.refresh, stripState);
            break;
        case 'rotate' :
            interval = rotate.startRotate( NUM_LEDS, pixelData,  ws281x, interval, req.body.refresh,  req.body.color, req.body.lit, stripState);
            break;
        case 'rawColor' :
            rawColor.raw( NUM_LEDS, pixelData,  ws281x, req.body.colorString, stripState);
            break;

    }
    res.json({stripState : stripState, pixelData: pixelData });

}).post('/scene', function (req, res){
    clearInterval(interval);
    console.log('Hello World');
    basicScenes.basicScence(NUM_LEDS, pixelData,  ws281x, req.body.scene, req.body.divisions, req.body.divisionType, stripState);
    res.json({ stripState : stripState, pixelData: pixelData})

});

router.post('/color', function (req, res) {
    clearInterval(interval);
    interval = color.setColor(NUM_LEDS, pixelData, ws281x, req.body.color, stripState );
    res.json({stripState : stripState, color: pixelData});
});

router.post('/brightness', function (req, res) {
    var brightnessValue = ((req.body.brightness / 100) * 255);
    ws281x.setBrightness(Math.floor(brightnessValue));
    res.json({effect: req.body.mode, power_state : stripState.power, color: pixelData})
});

router.post('/on', function (req, res) {
  clearInterval(interval);
  color.setColor(NUM_LEDS, pixelData, ws281x, req.body.color, stripState, true );
  res.json({stripState : stripState, color: pixelData});

});

//stop the the running function
router.get('/stop', function (req, res) {
    clearInterval(interval);
    res.json({message: 'Mode has been stopped'});

    //turn the lights off
}).get('/off', function (req, res) {
    stripState.power = false;
    delete stripState.effect;
    delete stripState.selectedScene;
    clearInterval(interval);

    interval = setInterval(function () {
        ws281x.setBrightness(stripState.brightness);
        ws281x.render(pixelData);
        stripState.brightness--;
        if(stripState.brightness<=0){
          clearInterval(interval);
        }
    }, (60/255));
    res.json({stripState: stripState});

    //get the current state information for the light
}).get('/state', function (req, res){
    res.json({ stripState: stripState,  pixel_color: pixelData});
});


io.on('connection', function (socket) {

    socket.emit('state', { stripState: stripState, pixelData : pixelData});

    //modes are effects
    socket.on('mode', function (data) {

        switch (data.mode) {
            case 'color':
                power = true;
                clearInterval(interval);
                var colorValue = data.color;
                color.setColor(NUM_LEDS, pixelData, ws281x, colorValue);
                break;
        console.log(data);
        socket.emit('state', { stripState: stripState, pixelData : pixelData});
    }});

    /**
     * State controls the play pause action
     */
    socket.on('state', function (data) {

        if (data.state === 'stop') {
            clearInterval(interval);
        }
        console.log(data.state);
    });

    /**
     * Set stripProprties
     */
    socket.on('stripProperties', function (data) {
        console.log(data);
        switch (data.property) {

            case 'brightness':
                var brightnessValue = ((data.brightnessLevel / 100) * 255);
                ws281x.setBrightness(Math.floor(brightnessValue));
                break;
            case 'power' :
                //if power is true turn it off
                if (power) {
                    var colorValue = 0x000000;
                    //save the last state
                    clearInterval(interval);
                    color.setColor(NUM_LEDS, pixelData, ws281x, colorValue)
                    stripState.power = false;

                    break;
                } else {

                    ws281x.render(pixelData);
                }
        }
    });


    socket.on('getStripProperties', function (data) {

        socket.emit('stripProperties', {color: pixelData, state: stripState.state, powerState: stripState.power});

    });

    socket.on('status', function (data) {

        console.log('Status Request Made')
        socket.emit('color', {color: pixelData[1]});

    });


});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/dist')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/mode', router);
app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json('error', {
        message: err.message,
        error: {}
    });
});

//helper functions move to new file

module.exports = {app: app, server: server};
