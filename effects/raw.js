/**
 * Send a hex string with one to one relationship to the pixel
 */

/**
 * var - Set each pixel by using a hex string
 *
 * @param  {Integer} num_leds  -  The number of pixels
 * @param  {Object} pixelData  - The pixelData array
 * @param  {Object} ws281x     - The stripo Object
 * @param  {String} colorString HEX String
 */
var rawColor= function(num_leds, pixelData, ws281x, colorString, stripState){

    var color = require('./color');
    var black = 0x000000;

    color.setColor(num_leds, pixelData, ws281x, black, stripState);

    colorArray = colorString.match(/.{1,6}/g);
    for(i=0; i<num_leds; i++){
        pixelData[i] = '0x' + colorArray[i];
    }

    //set the strip properties
    stripState.mode = 'effects';
    stripState.effect = 'raw';
    stripState.state = 'started';
    stripState.power = true;
    delete stripState.scene;

    ws281x.render(pixelData);

};

module.exports.raw = rawColor;
