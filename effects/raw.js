/**
 * Send a hex string with one to one relationship to the pixel
 */

/**
 * var - Set each pixel by using a hex string
 *
 * @param  {number} num_leds  -  The number of pixels
 * @param  {object} ws281x     - The stripo Object
 * @param  {uint32array} pixelData  - The pixelData array
 * @param  {string} colorString HEX String
 */
var rawColor= function(num_leds, pixelData, ws281x, colorString, stripState){

    //var color = require('./color');
    //var black = 0x000000;

  //  color.setColor(num_leds, pixelData, ws281x, black, stripState);

    var newColor = colorString.toString('hex');
    colorArray = newColor.match(/.{1,6}/g);

    for(i=0; i<num_leds; i++){
      //console.log(colorArray[i]);
        pixelData[i] = '0x' + colorArray[i];
    }

    //set the strip properties
    /*stripState.mode = 'effects';
    stripState.effect = 'raw';
    stripState.state = 'started';
    stripState.power = true;
    delete stripState.scene;*/

    ws281x.render(pixelData);

    stripState.mode.selectedMode = 'raw';
    stripState.mode.modeType = 'raw';
    stripState.mode.activeState = 'started';
    stripState.power = true;

};

module.exports.raw = rawColor;
