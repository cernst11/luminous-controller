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
var users = require('./routes/users');

var app = express();

//include socket stuff
var server = require('http').Server(app);
var io = require('socket.io')(server);


//Stip States
var interval;

var stripState ={
    state: 'start',
    power: false,
    effect:''

};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.io = io;
    next();
});

//set up and intialize the pixels
var NUM_LEDS = parseInt(process.argv[2], 300) || 300,
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
    stripState.effect = req.body.mode;
    switch (req.body.mode) {
        case 'breathe':
            stripState.power = true;
            interval = breathe.breathe(ws281x, interval, req.body.refresh);
            console.log(interval);
            break;
        case 'rainbow' :
            stripState.power = true;
            interval = rainbow.rainbow( NUM_LEDS, pixelData,  ws281x, interval, req.body.refresh);
            break;
        case 'theaterChase' :
            stripState.power = true;
            interval = theaterChase.theaterChase( NUM_LEDS, pixelData,  ws281x, req.body.color , interval, req.body.refresh);
            break;
        case 'rotate' :
            stripState.power = true;
            interval = rotate.rotate( NUM_LEDS, pixelData,  ws281x, interval, req.body.refresh,  req.body.color, req.body.lit);
            break;
        case 'rawColor' :
            stripState.power = true;
            rawColor.raw( NUM_LEDS, pixelData,  ws281x, req.body.colorString);
            break;


    }
    res.json({effect: req.body.mode, power_state : stripState.power, color: pixelData, stripState : stripState});
});

router.post('/scene', function (req, res){
    clearInterval(interval);
    stripState.power = true;
    basicScenes.basicScence(NUM_LEDS, pixelData,  ws281x, req.body.scene, req.body.divisions, req.body.divisionType);
    res.json({effect: req.body.mode, power_state : stripState.power, color: pixelData})

});


router.post('/color', function (req, res) {
    clearInterval(interval);
    color.color(NUM_LEDS, pixelData, ws281x, req.body.color );
    res.json({mode: req.body.mode, power_state : stripState.power, color: pixelData});

});

//stop the the running function
router.get('/stop', function (req, res) {
    //ws281x.render(pixelData);
    clearInterval(interval);
    res.json({message: 'Mode has been stopped'});
});

//turn the lights off
router.get('/off', function (req, res) {
    stripState.power = false;
    clearInterval(interval);
    var colorValue = 0x000000;
    color.color(NUM_LEDS, pixelData, ws281x, colorValue);
    res.json({message: 'Light has been turned off'});
});

//get the lights current state
router.get('/state', function (req, res){

    res.json({ power_state : stripState.power, color: pixelData, mode: stripState.effect});

});


io.on('connection', function (socket) {

    socket.emit('color', {color: pixelData});

    //modes are effects
    socket.on('mode', function (data) {

        switch (data.mode) {
            case 'color':
                power = true;
                clearInterval(interval);
                var colorValue = data.color;
                color.color(NUM_LEDS, pixelData, ws281x, colorValue);
                break;
        console.log(data);
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
                    color.color(NUM_LEDS, pixelData, ws281x, colorValue)
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
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/mode', router);
app.use('/', routes);
app.use('/users', users);

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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//helper functions move to new file


module.exports = {app: app, server: server};
