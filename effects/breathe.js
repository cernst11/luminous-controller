/**
 * Breathe the current lights in color brightness
 */

/**
 * Breath the current state of the light strip
 * @param {object | date} startValue - A dateobject to start the start of the wave
 * @param {object} ws281x - The strip object to control
 */
var breathe = function (startValue, ws281x) {

    var dt = Date.now() - startValue;
    ws281x.setBrightness(
        Math.floor(Math.sin(dt / 1000) * 128 + 128));

}


/**
 * anonymous function - Start the breate function
 *
 * @param  {object} ws281x  -       The strip object
 * @param  {object} interval  -     The interval object
 * @param  {number} refreshRate -  How quickly to breathe in milliseconds
 * @returns {object}                 The interval object
 */
var  startBreathe = function (ws281x, interval, refreshRate, stripState) {

    refreshRate = (typeof refreshRate  ==='undefined') ? (1000/30) : refreshRate;

    //clearInterval(interval);
    var startValue = Date.now();
    interval = setInterval(function () {
        breathe(startValue, ws281x);
    }, refreshRate);

    //set the strip properties
    stripState.mode.selectedMode = 'effects';
    stripState.mode.modeType = 'breathe';
    stripState.mode.activeState = 'started';
    stripState.power = true;

    return interval;
}

module.exports.startBreathe = startBreathe;
