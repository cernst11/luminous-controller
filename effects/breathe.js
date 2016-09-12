'use strict';
/**
 * Breathe the current lights in color brightness
 */

/**
 * Breath the current state of the light strip
 * @param {object | date} startValue - A dateobject to start the start of the wave
 * @param {object} stripState - The strip object to control
 */
var breathe = function (startValue, stripState) {

    var dt = Date.now() - startValue;
    stripState.brightness =
        Math.floor(Math.sin(dt / 1000) * 128 + 128);

};


/**
 * anonymous function - Start the breate function

 * @param  {object} interval  -     The interval object
 * @param  {number} refreshRate -  How quickly to breathe in milliseconds
 * @returns {object}                 The interval object
 */
var  startBreathe = function (interval,  stripState, refreshRate = (1000/30)) {

    //clearInterval(interval);
    var startValue = Date.now();
    interval = setInterval(function () {
        breathe(startValue, stripState);
    }, refreshRate);

    //set the strip properties
    stripState.setMode('effects', 'breathe', 'started');
    stripState.power = true;

    return interval;
};

module.exports.startBreathe = startBreathe;
