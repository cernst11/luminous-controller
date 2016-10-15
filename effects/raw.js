'use strict';
/**
 * Send a hex string with one to one relationship to the pixel
 */

/**
 * var - Set each pixel by using a hex string
 *
 * @param  {string} colorString HEX String
 *  @param  {object} the strip to control
 */
var rawColor= function( colorString, stripState){

  var newColor = colorString.toString('hex');
  var colorArray = newColor.match(/.{1,6}/g);

  for(var i=0; i<stripState.numLEDS; i++){
    //console.log(colorArray[i]);
      stripState.pixelData[i] = '0x' + colorArray[i];
  }

    stripState.render();
    stripState.setMode('raw', 'raw', 'started');
    stripState.power = true;

};

module.exports.raw = rawColor;
