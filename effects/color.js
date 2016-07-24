/**
 *  Module to send an individual  color
 */


var colorHelper1 = require('../helpers/colorHelper').colorHelper;
/**
 *  Set a color for all the pixels
 * @param num_pixels
 * @param ws281x
 * @param color
 */
var color = function(num_pixels, pixelData, ws281x, color){
    for(var i = 0; i < num_pixels; i++) {
        pixelData[i] = color;
    }
    ws281x.render(pixelData);
}

module.exports.color = color;
