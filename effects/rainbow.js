/**
 * Created by ernst on 5/28/16.
 */

var rgb2Int = require('./colorHelper');

/**
 * Helper funnction to calculate colors
 * @param pos Position in the color wheel
 * @returns {*} Color Object
 */
function colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) { return rgb2Int.rgb2Int(255 - pos * 3, 0, pos * 3); }
    else if (pos < 170) { pos -= 85; return rgb2Int.rgb2Int(0, pos * 3, 255 - pos * 3); }
    else { pos -= 170; return rgb2Int.rgb2Int(pos * 3, 255 - pos * 3, 0); }
}


/**
 * The effect for rainbow mode
 * @param num_leds The number of leds to use
 * @param pixelData The pixelData object to use
 * @param offset The offset to use outside of the setInterval function
 * @param ws281x The strip object to control

 */
var rainbow =  function (num_leds, pixelData, offset, ws281x) {

    for (var i = 0; i < num_leds; i++) {
        pixelData[i] = colorwheel((offset + i) % 256);

    }
    offset = (offset + 1) % 256;
    ws281x.render(pixelData);

    return offset;

}

module.exports.rainbow = rainbow;


