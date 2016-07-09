var rgb2Int = require('./colorHelper');
var color = require('./color');
var black = 0x000000;

/**
 * Display the lights
 * @param {object} pixelData - The strip pixel data
 * @param {integer} lit - The iteration in the loop
 * @param {object} ws281x - The strip object
 * @param {integer} colorValue - The hex color value to set
 */
var theaterChase = function (pixelData, lit, ws281x, colorValue){
    //set the pixel in the strip
    pixelData[lit] = colorValue;
    ws281x.render(pixelData);
};


/**
 * Chase lights like in a theater
 * @param {integer} num_leds - The number of leds
 * @param {object} pixelData - The pixel data
 * @param {object} ws281x - The strip object
 * @param {integer} colorValue - The hex color value to use
 * @param {integer} interval - The interval object
 * @param {integer} stepRate - The rate at which the animation goes in milliseconds
 * @returns {object} The interval object
 */
var  startTheaterChase = function(num_leds, pixelData, ws281x, colorValue, interval, stepRate){

    stepRate = (typeof stepRate  ==='undefined') ? 250 : stepRate;
    colorValue = (typeof  colorValue  === 'undefined') ? 0xFFFFFF : colorValue
    console.log(colorValue);

    color.color(num_leds, pixelData, ws281x, black);
    var lit  = 1;
    interval = setInterval(function () {
        theaterChase(pixelData, lit, ws281x, colorValue);
        if(lit == num_leds){
            lit = 0;
            color.color(num_leds, pixelData, ws281x, black);
        }else {
            lit++;
        }

    }, stepRate);

    return interval;


};

module.exports.theaterChase = startTheaterChase;
