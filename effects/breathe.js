/**
 * Breathe the current lights in color brightness
 */

/**
 * Breath the current state of the light strip
 * @param startValue A dateobject to start the start of the wave
 * @param ws281x The strip object to control
 */
var breathe = function (startValue, ws281x) {

    var dt = Date.now() - startValue;
    ws281x.setBrightness(
        Math.floor(Math.sin(dt / 1000) * 128 + 128));

}


/**
 * anonymous function - Start the breate function
 *
 * @param  {Object} ws281x  -       The strip object
 * @param  {Object} interval  -     The interval object
 * @param  {Integer} refreshRate -  How quickly to breathe in milliseconds
 * @return {Object}                 The interval object
 */
var  startBreathe = function (ws281x, interval, refreshRate, stripState) {

    refreshRate = (typeof refreshRate  ==='undefined') ? (1000/30) : refreshRate;

    //clearInterval(interval);
    var startValue = Date.now();
    interval = setInterval(function () {
        breathe(startValue, ws281x);
    }, refreshRate);

    //set the strip properties
    stripState.mode = 'effects';
    stripState.effect = 'breathe';
    stripState.state = 'started';
    stripState.power = true;
    delete stripState.scene;

    return interval;
}

module.exports.startBreathe = startBreathe;
