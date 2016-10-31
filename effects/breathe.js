'use strict';
/**
 * Breathe the current lights in color brightness
 */

/**
 * Breathe the current state of the light strip
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

 * @param  {object} stripState  -  The light strip to control
 * @param  {number} refreshRate -  How quickly to breathe in milliseconds
 */
var  startBreathe = function (stripState, refreshRate = (1000/30)) {

    //clearInterval(interval);
    var startValue = Date.now();
    stripState.interval = setInterval(function () {
        breathe(startValue, stripState);
    }, refreshRate);

    //set the strip properties
    stripState.setMode('effects', 'breathe', 'started');
    stripState.power = true;


};

module.exports.startBreathe = startBreathe;
