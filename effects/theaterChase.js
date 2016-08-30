/**
 *Have the lights chase like in a theater
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
var theaterChase = function (pixelData, lit, ws281x, colorValue){
    //set the pixel in the strip
    pixelData[lit] = colorValue;
    ws281x.render(pixelData);
};


/**
 * Chase lights like in a theater
 * @param {number} num_leds - The number of leds
 * @param {uint32array} pixelData - The pixel data
 * @param {object} ws281x - The strip object
 * @param {number} colorValue - The hex color value to use
 * @param {object} interval - The interval object
 * @param {number} refreshRate - The rate at which the animation goes in milliseconds
 * @returns {object} The interval object
 */
var  startTheaterChase = function(num_leds, pixelData, ws281x, colorValue = 0xFFFFFF, interval, refreshRate = 250, stripState){

    color.setColor(num_leds, pixelData, ws281x, black, stripState);
    var lit  = 1;
    interval = setInterval(function () {
        theaterChase(pixelData, lit, ws281x, colorValue);
        if(lit == num_leds){
            lit = 0;
            color.setColor(num_leds, pixelData, ws281x, black, stripState);
        }else {
            lit++;
        }

    }, refreshRate);

    //set the strip properties
    stripState.setMode('effects', 'theaterChase', 'started');
    stripState.power = true;
    return interval;


};

module.exports.startTheaterChase = startTheaterChase;
