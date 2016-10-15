'use strict';
/**
 * Rainbow effect
 */

//import the colorHelper object
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
 * @param {number} num_leds - The number of leds to use
 * @param {uint32array} stripState.pixelData - The stripState.pixelData object to use
 * @param {number} offset - The offset to use outside of the setInterval function
 * @param {object} stripState - The strip object to control
 */
var rainbow =  function ( stripState, offset) {

    var NUM_LEDS = stripState.numLEDS;

    for (var i = 0; i < NUM_LEDS; i++) {
        stripState.pixelData[i] = colorwheel((offset + i) % 256);
    }
    offset = (offset + 1) % 256;
    stripState.render();
    return offset;

};

/**
 * Start the rainbow effect
 * @param {number} NUM_LEDS - The number of leds
 * @param {object} interval - The interval object
 * @param {number} refreshRate - The upodate rate for the effect
 * @returns {object} - The interval referance
 */

var startRainbow = function  (  stripState, refreshRate = (10000/30)){

    var offSet= 0;

    stripState.interval = setInterval(function () {
        offSet  = rainbow( stripState,  offSet);

    }, refreshRate);

    //set the strip properties
    stripState.setMode('effects', 'rainbow', 'started');
    stripState.power = true;
    //return interval;
};

module.exports.startRainbow = startRainbow;
