'use strict';
/**
 * Send a hex string with one to one relationship to the pixel
 */

/**
 * var - Set each pixel by using a hex string
 *
 * @param  {number} num_leds  -  The number of pixels
 * @param  {uint32array} pixelData  - The pixelData array
 * @param  {string} colorString HEX String
 */
var rawColor= function( pixelData, colorString, stripState){

  var newColor = colorString.toString('hex');
  var colorArray = newColor.match(/.{1,6}/g);

  for(var i=0; i<stripState.numLEDS; i++){
    //console.log(colorArray[i]);
      pixelData[i] = '0x' + colorArray[i];
  }

    stripState.render(pixelData);
    stripState.setMode('raw', 'raw', 'started');
    stripState.power = true;

};

module.exports.raw = rawColor;
