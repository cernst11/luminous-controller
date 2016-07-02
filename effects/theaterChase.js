var rgb2Int = require('./colorHelper');
var color = require('./color');
var black = 0x000000;


var theaterChase = function (pixelData, lit, ws281x, colorValue){

    pixelData[lit] = colorValue;
    //theaterChase (lit, pixelData, ws281x, 0xFFFFFF)
    ws281x.render(pixelData);
};


/**
 * Chase lights like in a theater
 * @param num_leds The number of leds   
 * @param pixelData The pixel data
 * @param ws281x The strip object
 * @param colorValue The color value to use
 * @param interval The interval object  
 * @param stepRate The rate at which the animation goes in milliseconds
 * @returns {number|*} The interval object
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
