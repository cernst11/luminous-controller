'use strict';
/**
 *  Module to send an individual  color
 */


/**
 * var  - Set the strip to a single color
 *
 * @param  {number} color      - The hex integer color
 * @param  {object} stripstate  - The strip object to control
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
