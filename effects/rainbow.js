/**
 * Rainbow effect
 */

var colorHelper = require('../helpers/colorHelper').colorHelper;

/**
 * Helper funnction to calculate colors
 * @param pos - Position in the color wheel
 * @returns {*} Color Object
 */
function colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) {
        return colorHelper.rgb2Int(255 - pos * 3, 0, pos * 3);
    }else if (pos < 170) {
        pos -= 85; return colorHelper.rgb2Int(0, pos * 3, 255 - pos * 3);
    }else {
        pos -= 170; return colorHelper.rgb2Int(pos * 3, 255 - pos * 3, 0);
    }
}


/**
 * The effect for rainbow mode
 * @param {integer} num_leds - The number of leds to use
 * @param {object} pixelData - The pixelData object to use
 * @param {integer} offset - The offset to use outside of the setInterval function
 * @param {object} ws281x - The strip object to control

 */
var rainbow =  function (num_leds, pixelData, offset, ws281x) {

    for (var i = 0; i < num_leds; i++) {
        pixelData[i] = colorwheel((offset + i) % 256);

    }
    offset = (offset + 1) % 256;
    ws281x.render(pixelData);

    return offset;

}

/**
 * Start the rainbow effect
 * @param {integer} NUM_LEDS - The number of leds
 * @param {object} pixelData - The pixel data
 * @param {object} ws281x - The strip object
 * @param {object} interval - The interval object
 * @param {integer} refreshRate - The upodate rate for the effect
 * @returns {object} - The interval referance
 */

var startRainbow = function  (NUM_LEDS, pixelData,  ws281x, interval, refreshRate){

    //set default refresh rate if none is passed
    refreshRate = (typeof refreshRate  ==='undefined') ? (1000/30) : refreshRate;

    var offSet= 0;
    interval = setInterval(function () {
        offSet  = rainbow(NUM_LEDS, pixelData, offSet, ws281x);

    }, refreshRate);

    return interval;
}

module.exports.rainbow = startRainbow;
