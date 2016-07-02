/**
 * Created by ernst on 5/28/16.
 */


var rgb2Int = require('./colorHelper');


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
 * Start the effect
 * @param ws281x The strip object to control
 */
var  startBreathe = function (ws281x, interval, refreshRate) {

    refreshRate = (typeof refreshRate  ==='undefined') ? (1000/30) : refreshRate;
    
    //clearInterval(interval);
    var startValue = Date.now();
    interval = setInterval(function () {
        breathe(startValue, ws281x);
    }, refreshRate);

    return interval;
}

module.exports.breathe = startBreathe;
