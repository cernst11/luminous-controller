/**
 * Rotate a fixed number of leds arround the strip
 */

var color = require('./color');
var black = 0x000000;

/**
 * Display the lights
 * @param {Object} pixelData - The strip pixel data
 * @param {Integer} lit - The iteration in the loop
 * @param {Object} ws281x - The strip object
 * @param {Integer} colorValue - The hex color value to set
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
 * @param {Integer} NUM_LEDS - The number of leds
 * @param {Object} pixelData - The pixel data
 * @param {Object} ws281x - The strip object
 * @param {Object} interval - The interval object
 * @param {Integer} refreshRate - The upodate rate for the effect
 * @param {Integer} colorValue - The hex color value to set
 * @param {Integer} litLeds - The number of lights to light to lightup
 * @returns {Object} - The interval object
 */
var startRotate = function  (NUM_LEDS, pixelData,  ws281x, interval, refreshRate, colorValue, litLeds){

    //set the default values
    refreshRate = (typeof refreshRate  ==='undefined') ? (1000/1) : refreshRate;
    colorValue = (typeof  colorValue  === 'undefined') ? 0xFFFFFF : colorValue;
    litLeds = (typeof  litLeds  === 'undefined') ? 4 : litLeds;
    color.setColor(NUM_LEDS, pixelData, ws281x, black);

    //set the default
    for(i=0; i<=litLeds -1; i++){
        pixelData[i]=colorValue;
    }

    interval = setInterval(function () {
        rotate(pixelData, ws281x, colorValue);
    }, refreshRate )


    return interval;
}

module.exports.startRotate = startRotate;
