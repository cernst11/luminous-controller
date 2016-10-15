'use strict';
/**
 *Have the lights chase like in a theater
 */
var color = require('./color');
var black = 0x000000;

/**
 * Display the lights
 * @param {number} lit - The iteration in the loop
 * @param {object} stripState - The strip object
 * @param {number} colorValue - The hex color value to set
 */
var theaterChase = function ( lit, stripState, colorValue){
    //set the pixel in the strip
    stripState.pixelData[lit] = colorValue;
    stripState.render();
};


/**
 * Chase lights like in a theater
 * @param {object} stripState - The strip object
 * @param {number} colorValue - The hex color value to use
 * @param {number} refreshRate - The rate at which the animation goes in milliseconds
 */
var  startTheaterChase = function( stripState, colorValue = 0xFFFFFF, refreshRate = 250 ){

    color.setColor(black, stripState);
    var lit  = 1;
    stripState.interval = setInterval(function () {
        theaterChase(lit, stripState, colorValue);
        if(lit === stripState.numLEDS){
            lit = 0;
            color.setColor(black, stripState);
        }else {
            lit++;
        }

    }, refreshRate);

    //set the strip properties
    stripState.setMode('effects', 'theaterChase', 'started');
    stripState.power = true;


};

module.exports.startTheaterChase = startTheaterChase;
