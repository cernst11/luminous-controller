'use strict';
/**
 * Rotate a fixed number of leds arround the strip
 */

var color = require('./color');
var black = 0x000000;

/**
 * Display the lights
 * @param {number} lit - The iteration in the loop
 * @param {object} ws281x - The strip object
 * @param {number} colorValue - The hex color value to set
 */
var rotate =  function (stripState){
    //Copy the type array to a genric array so that we can push and unshifted
    var tempArray =[];
    for(var i=0; i<stripState.numLEDS; i++){
        tempArray[i] = stripState.stripState.pixelData[i];
    }
    //Get and remove the last value
    var pop_value = tempArray.pop();
    //move the last value to the start of the array
    tempArray.unshift(pop_value);
    //copy array back to orginal array
    for(i=0; i<tempArray.length; i++){
        stripState.pixelData[i] = tempArray[i];
    }

    stripState.render();
};

/**
 * Start the rainbow effect
 * @param {number} NUM_LEDS - The number of leds
 * @param {object} interval - The interval object
 * @param {number} refreshRate - The upodate rate for the effect
 * @param {number} colorValue - The hex color value to set
 * @param {number} litLeds - The number of lights to light to lightup
 * @returns {object} - The interval object
 */
var startRotate = function  ( stripState, refreshRate = (1000/10), colorValue = 0xFFFFFF, fillColorValue = 0x000000, litLeds = 10 ){

    //set Color to 0
    color.setColor( black, stripState);

    //set the default
    for(var i=0; i<=litLeds -1; i++){
        stripState.pixelData[i]=colorValue;
    }
    for(var j=litLeds; j<=stripState.numLEDS ; j++){
        stripState.pixelData[j]=fillColorValue;
    }

    stripState.interval = setInterval(function () {
        rotate(stripState);
    }, refreshRate );


    //set the strip properties
    stripState.setMode('effects', 'rotate', 'started');
    stripState.power = true;

};

module.exports.startRotate = startRotate;
