/**
 * Rotate a fixed number of leds arround the strip
 */

var color = require('./color');
var black = 0x000000;

/**
 * Display the lights
 * @param {uint32array} pixelData - The strip pixel data
 * @param {number} lit - The iteration in the loop
 * @param {object} ws281x - The strip object
 * @param {number} colorValue - The hex color value to set
 */
var rotate =  function (pixelData, ws281x){
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
 * @param {number} NUM_LEDS - The number of leds
 * @param {uint32array} pixelData - The pixel data
 * @param {object} ws281x - The strip object
 * @param {object} interval - The interval object
 * @param {number} refreshRate - The upodate rate for the effect
 * @param {number} colorValue - The hex color value to set
 * @param {number} litLeds - The number of lights to light to lightup
 * @returns {object} - The interval object
 */
var startRotate = function  (NUM_LEDS, pixelData,  ws281x, interval, refreshRate = (1000/10), colorValue = 0xFFFFFF, fillColorValue = 0x000000, litLeds = 10, stripState){

    //set Color to 0
    color.setColor(NUM_LEDS, pixelData, ws281x, black, stripState);

    //set the default
    for(i=0; i<=litLeds -1; i++){
        pixelData[i]=colorValue;
    }
    for(j=litLeds; j<=NUM_LEDS ; j++){
        pixelData[j]=fillColorValue;
    }

    interval = setInterval(function () {
        rotate(pixelData, ws281x);
    }, refreshRate )


    //set the strip properties
    stripState.setMode('effects', 'rotate', 'started');
    stripState.power = true;

    return interval;
}

module.exports.startRotate = startRotate;
