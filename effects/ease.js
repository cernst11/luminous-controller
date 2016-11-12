'use strict';
/**
 * Ease the current lights in to the strip using different methods
 */

const easing = require('easing-utils');

/**
 * 
 * Ease the lights
 * @param {object} stripState - The light strip to control
 * @param {string} easeType - How to ease the strip
 * @param {number} refreshRate - Hoe many times a seconds to trigger
 * @param {number} duration - How long to run the effects
 * @param {number} postition - The posttion in the ease effect 
 * @param {object | number} - colors The object of colors to use or a single color
 */
function ease(stripState, easeType, refreshRate, duration, postition, colors) {

    let litLeds = 0;
    //check if they passed a valid easre property if not go to default
    if(typeof easing[easeType] !== 'undefined'){
        litLeds = Math.floor(easing[easeType](postition) * stripState.numLEDS);
    }else{
        litLeds = easing.easeOutCirc(postition) * stripState.numLEDS;
    }

    //check if object ot color and appply the correct array copy method
    if (typeof colors === 'object') {
        for (let i = 0; i <= litLeds; i++) {
            stripState.pixelData[i] = colors[i];
        }
    }else{
        for (let i = 0; i <= litLeds; i++) {
            stripState.pixelData[i] = colors;
        }
    }

    //fill in the rest of the leds 
    let blankLEDS = (stripState.numLEDS - litLeds);

    for(let i = litLeds+1; i<=blankLEDS; i++){
         stripState.pixelData[i] = 0x000000;
     }

    stripState.render();

};


/**
 * anonymous function - Start the ease function

 * @param  {object} stripState  -  The light strip to control
 * @param  {string} easeType -  How to ease the strip
 * @param {object | number} - colors The object of colors to use or a single color
 * @param  {number} refreshRate -  How quickly to recalculate the ease postition in milliseconds
 * @param  {number}  duration -  How  long the ease should last in mill
 * 
 * 
 */
var startEase = function (stripState, easeType = 'easeOutCirc', colors=0xFFFFFF, refreshRate = (1000 / 30), duration = 2000) {

    let postition = 0;
    let easeIncrement = refreshRate / duration;
    stripState.interval = setInterval(function () {

        ease(stripState, easeType, refreshRate, duration, postition, colors);

        if (postition < 1) {
            postition = postition + easeIncrement;
        } else {
            clearInterval(stripState.interval);
        }

    }, refreshRate);

    stripState.setMode('effects', 'ease', 'started');
    stripState.power = true;

};


module.exports.startEase = startEase;