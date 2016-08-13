/**
 *  Module to send an individual  color
 */


/**
 * var - description  - Set the strip to a single color
 *
 * @param  {number} num_pixels - The number of pixels
 * @param  {uint32array} pixelData  - The pixel data
 * @param  {object} ws281x     - THe strip Object
 * @param  {number} color      - The hex integer color
 * @param  {boolean} fadeIn     - Fade in to the color
 */
var color = function(num_pixels, pixelData, ws281x, color, stripState, fadeIn) {

  fadeIn = (typeof fadeIn === 'undefined') ? false : fadeIn;

  for (var i = 0; i < num_pixels; i++) {
    pixelData[i] = color;
  }

  if (!fadeIn) {
    ws281x.render(pixelData);
  } else {
    stripState.brightness = 0
    interval = setInterval(function() {
      ws281x.setBrightness(stripState.brightness);
      ws281x.render(pixelData);
      stripState.brightness++;
      if (stripState.brightness >= 255) {
        clearInterval(interval);
      }
    }, (60 / 255));

    return interval;

  }

  stripState.mode.selectedMode = 'color';
  stripState.mode.modeType = 'color';
  stripState.mode.activeState = 'started';
  stripState.power = true;


}

module.exports.setColor = color;
