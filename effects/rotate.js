/**
 * Created by ernst on 7/10/15
 *
 * Rotate a fixed number of leds arround the strip
 */

var color = require('./color');
var black = 0x000000;



/**
 * Display the lights
 * @param {object} pixelData - The strip pixel data
 * @param {integer} lit - The iteration in the loop
 * @param {object} ws281x - The strip object
 * @param {integer} colorValue - The hex color value to set
 */
var rotate =  function (pixelData, ws281x, colorValue){
    //Copy the type array to a genric array so that we can push and unshifted
    var tempArray =[];
    for(i=0; i<pixelData.length; i++){
        tempArray[i] = pixelData[i];
    }
    //Get and remove the last value
    var pop_value = tempArray.pop();
    //move the last value to the start of the array
    tempArray.unshift(pop_value);
    //copy array back to orginal array
    for(i=0; i<tempArray.length; i++){
        pixelData[i] = tempArray[i];
    }

    ws281x.render(pixelData);
};

/**
 * Start the rainbow effect
 * @param {integer} NUM_LEDS - The number of leds
 * @param {object} pixelData - The pixel data
 * @param {object} ws281x - The strip object
 * @param {object} interval - The interval object
 * @param {integer} refreshRate - The upodate rate for the effect
 * @param {integer} colorValue - The hex color value to set
 * @param {integer} litLeds - The number of lights to light to lightup
 * @returns {object} - The interval object
 */
var startRotate = function  (NUM_LEDS, pixelData,  ws281x, interval, refreshRate, colorValue, litLeds){

    //set the default values
    refreshRate = (typeof refreshRate  ==='undefined') ? (1000/1) : refreshRate;
    colorValue = (typeof  colorValue  === 'undefined') ? 0xFFFFFF : colorValue;
    litLeds = (typeof  litLeds  === 'undefined') ? 4 : litLeds;
    color.color(NUM_LEDS, pixelData, ws281x, black);

    //set the default
    for(i=0; i<=litLeds; i++){
        pixelData[i]=colorValue;
    }

    interval = setInterval(function () {
        rotate(pixelData, ws281x, colorValue);
    }, refreshRate )


    return interval;
}




module.exports.rotate = startRotate;
