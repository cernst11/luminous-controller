/**
 *  Module to send an individual  color
 */


/**
 * var - description  - Set the strip to a single color
 *
 * @param  {Integer} num_pixels The number of pixels
 * @param  {Object} pixelData  The pixel data
 * @param  {Object} ws281x     THe strip Object
 * @param  {Integer} color      The hex integer color
 * @param  {boolean} fadeIn      Fade in to the color
 */
var color = function(num_pixels, pixelData, ws281x, color, stripState, fadeIn){

stripState.mode = 'on';
stripState.state = 'started';
stripState.power = true;
delete stripState.scene;
delete stripState.effect;

console.log(stripState);
fadeIn = (typeof fadeIn  ==='undefined') ? false : fadeIn;

for(var i = 0; i < num_pixels; i++) {
    pixelData[i] = color;
}

if(!fadeIn){
    ws281x.render(pixelData);
  }else{
    stripState.brightness = 0
    interval = setInterval(function () {
        ws281x.setBrightness(stripState.brightness);
        ws281x.render(pixelData);
        stripState.brightness++;
        if(stripState.brightness>=255){
          clearInterval(interval);
        }
    }, (60/255));

    return interval;

  }


}

module.exports.setColor = color;
