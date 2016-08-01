/**
 *  Module to send an individual  color
 */


/**
 * var - description  - Set the strip to a single color
 *
 * @param  {Integer} num_pixels The number of pixels
 * @param  {Object} pixelData  The pixel data
 * @param  {Object} ws281x     THe strip Object
 * @param  {Integer} color      The hex integer color
 */
var color = function(num_pixels, pixelData, ws281x, color){
    for(var i = 0; i < num_pixels; i++) {
        pixelData[i] = color;
    }
    ws281x.render(pixelData);
}

module.exports.setColor = color;
