
var color = require('./color');
var black = 0x000000;


/**
 * Set each pixel value from a calor string
 * @param num_leds
 * @param pixelData
 * @param ws281x
 * @param colorString
 */
var rawColor= function(num_leds, pixelData, ws281x, colorString){

    color.color(num_leds, pixelData, ws281x, black);

    colorArray = colorString.match(/.{1,6}/g);
    for(i=0; i<num_leds; i++){
        pixelData[i] = '0x' + colorArray[i];
    }
    ws281x.render(pixelData);

};

module.exports.raw = rawColor;
