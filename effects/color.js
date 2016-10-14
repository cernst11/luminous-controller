'use strict';
/**
 *  Module to send an individual  color
 */


/**
 * var - description  - Set the strip to a single color
 *
 * @param  {number} num_pixels - The number of pixels
 * @param  {uint32array} pixelData  - The pixel data
 * @param  {number} color      - The hex integer color
 * @param  {boolean} fadeIn     - Fade in to the color
 */
var color = function(color, stripState) {

  for (var i = 0; i < stripState.numLEDS; i++) {
    stripState.pixelData[i] = color;
  }

  stripState.render();

  if (typeof stripState !== 'undefined'  ) {
    stripState.setMode('color', 'color', 'started');
    stripState.power = true;
  }


};

module.exports.setColor = color;
