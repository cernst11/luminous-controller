/**
 * Send a hex string with one to one relationship to the pixel
 */

/**
 * var - Set each pixel by using a hex string
 *
 * @param  {Integer} num_leds    The number of pixels
 * @param  {Object} pixelData   The pixelData array
 * @param  {Object} ws281x      The stripo Object
 * @param  {String} colorString HEX String
 */
var rawColor= function(num_leds, pixelData, ws281x, colorString){

    var color = require('./color');
    var black = 0x000000;

    color.setColor(num_leds, pixelData, ws281x, black);

    colorArray = colorString.match(/.{1,6}/g);
    for(i=0; i<num_leds; i++){
        pixelData[i] = '0x' + colorArray[i];
    }
    ws281x.render(pixelData);

};

module.exports.raw = rawColor;
