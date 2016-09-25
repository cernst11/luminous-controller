'use strict';
var color = require('./color');


/**
 *  Set the power on or off
 * @param  {number} stripState.numLEDS    description
 * @param  {uint32array} pixelData   description
 * @param  {object} interval    description
 * @param  {number} colorValue  description
 * @param  {string} toPowerMode description
 * @param  {object} stripState  description
 * @return {type}             description
 */
function setPower(pixelData, interval, colorValue, toPowerMode, stripState, previousColorArray) {
  console.log(stripState);
  clearInterval(interval);
  //if coming from a a std off
  if (stripState.brightness <= 0 && toPowerMode === 'on') {
    for (var i = 0; i < stripState.numLEDS; i++) {
        pixelData[i] = previousColorArray[i];
      }

      stripState.render(pixelData);

      fadePowerOn(interval, stripState);

    //If coming from a server restart
  } else if (stripState.brightness === 255 && stripState.power === false) {
      stripState.brightness = 0;
      color.setColor(stripState.numLEDS, pixelData, 0xFFFFFF);
      fadePowerOn(interval, stripState);


  } else if (toPowerMode === 'off' && stripState.power === true) {

    var colorArray;
    colorArray = pixelData.slice(0);
    interval = setInterval(function() {
      stripState.render(pixelData);
      if (stripState.brightness <= 0) {
        console.log(stripState);
        //stripState.setBrightness(0);
        color.setColor( pixelData, 0x000000, stripState);
        stripState.power = false;
        stripState.setMode('off', 'off', 'stopped');
        clearInterval(interval);
      }else {
        stripState.brightness = stripState.brightness - 1;
      }

    }, (60 / 255));
      //brightness 0 is not actually completley off so set to black and return the previous color array
    return colorArray;
  }

}

/**
 * var - fade the power on
 *
 * @param  {object} interval   The interval object
 * @param  {object} stripState The state of the strip
 */
function fadePowerOn(interval, stripState) {

  stripState.power = true;
  stripState.setMode('on', 'on', 'stopped');

  interval = setInterval(function() {
    if (stripState.brightness >= 255) {
      clearInterval(interval);
    } else {
      stripState.brightness =  stripState.brightness + 1;
    }
  }, 60 / 255);

}




module.exports.setPower = setPower;
