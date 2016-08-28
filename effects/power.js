var color = require('./color');


/**
 * var - fade the power on
 *
 * @param  {object} interval   The interval object
 * @param  {object} ws281x     The strip object
 * @param  {object} stripState The state of the strip
 */
var fadePowerOn = function(interval, ws281x, stripState) {

  stripState.power = true;
  stripState.setMode('on', 'on', 'stopped');

  interval = setInterval(function() {
    if (stripState.brightness >= 255) {
      clearInterval(interval);
    } else {
      stripState.brightness++;
      ws281x.setBrightness(stripState.brightness);
    }
  }, 60 / 255);

}


/**
 *  Set the power on or off
 * @param  {number} num_pixels    description
 * @param  {uint32array} pixelData   description
 * @param  {object} ws281x      description
 * @param  {object} interval    description
 * @param  {number} colorValue  description
 * @param  {string} toPowerMode description
 * @param  {object} stripState  description
 * @return {type}             description
 */
var setPower = function(num_pixels, pixelData, ws281x, interval, colorValue, toPowerMode, stripState, previousColorArray) {
  console.log(stripState);
  clearInterval(interval);
  //if coming from a a std off
  if (stripState.brightness <= 0 && toPowerMode === 'on') {
    for (var i = 0; i < num_pixels; i++) {
      pixelData[i] = previousColorArray[i];
    }

    ws281x.render(pixelData);

    fadePowerOn(interval, ws281x, stripState);

    //If coming from a server restart
  } else if (stripState.brightness === 255 && stripState.power === false) {
    stripState.brightness = 0;
    ws281x.setBrightness(0);
    color.setColor(num_pixels, pixelData, ws281x, 0xFFFFFF);
    fadePowerOn(interval, ws281x, stripState);


  } else if (toPowerMode === 'off' && stripState.power === true) {

    stripState.setMode('off', 'off', 'stopped');
    stripState.power = false;
    var colorArray;
    colorArray = pixelData.slice(0);
    interval = setInterval(function() {
      ws281x.render(pixelData);
      if (stripState.brightness <= 0) {
        colorArray = pixelData.slice(0);
        stripState.setBrightness = 0;
        color.setColor(num_pixels, pixelData, ws281x, 0x000000);
        clearInterval(interval);
      }else {
        ws281x.setBrightness(stripState.brightness);
        stripState.brightness--;
      }

    }, (60 / 255));
      //brightness 0 is not actually completley off so set to black and return the previous color array
    return colorArray;


  }

}



module.exports.setPower = setPower;
