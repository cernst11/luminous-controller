/**
 * Helper class for colors
 */
var colorHelper = {

  tinyColor: require("tinycolor2"),

  /**
   * fadeColor - Calculate the color intermediate colors between to hex values using hsl transform
   *
   * @param  {number} startHex The starting hex value
   * @param  {number} endHex   The ending hex value
   * @param  {number} steps    The number of steps btween the two points
   * @return {Array}            Array of new values
   */
  fadeColor: function(startHex, endHex, steps) {

    startHex = this.hexToHexString(startHex);
    endHex = this.hexToHexString(endHex);

    var color1 = this.tinyColor(startHex);
    var color2 = this.tinyColor(endHex);
    var startHsl = color1.toHsl();
    var endHsl = color2.toHsl();

    //Calculate the amount to increment by on each led
    var hueStepValue = (endHsl.h - startHsl.h) / steps;
    var satStepValue = (endHsl.s - startHsl.s) / steps;
    var lumStepValue = (endHsl.l - startHsl.l) / steps;
    var hexStepArray = [];
    var x = [hueStepValue, satStepValue, lumStepValue];

    //increment hsl value and covert back to hex
    for (i = 1; i <= steps; i++) {

      var h = startHsl.h + (hueStepValue * i);
      var s = startHsl.s + (satStepValue * i);
      var l = startHsl.l + (lumStepValue * i);
      var hsl = {
        h: h,
        s: s,
        l: l
      };

      var newColor = this.tinyColor(hsl);
      hexStepArray[i - 1] = (newColor.toHex());


    }
    return hexStepArray;
  },



/**
 * setHslBrightness - Set the brighhtness via HSL manipulation
 *
 * @param  {number} num_pixels        description
 * @param  {object} ws281x            description
 * @param  {uint32array} pixelData         description
 * @param  {number} brightnessPercent description
 * @return {type}                   description
 */
setHslBrightness: function(num_pixels, ws281x, pixelData, brightnessPercent) {

    for (i = 0; i < num_pixels; i++) {
      var color = this.hexToHexString(pixelData[i]);
      console.log(pixelData[i]);
      color = this.tinyColor(color);
      var hslColor = color.toHsl();
      hslColor.l = (brightnessPercent / 100);
      var newColor = this.tinyColor(hslColor);
      pixelData[i] = parseInt(newColor.toHex(), 16);

    }
    ws281x.render(pixelData);

  },



  /**
   * rgb2Int - Convert rgb value to hex integer
   *
   * @param  {number} r Red integer value
   * @param  {number} g Green integer value
   * @param  {number} b Blue integer value
   * @return {number}   The integer(HEX) value of the RGB value
   */
  rgb2Int: function(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
  },


  /**
   * anonymous function - Convert hex Int to hex String
   *
   * @param  {string} hexValue The current HEX value
   * @return {string}          The padded string HEX value
   */
  hexToHexString: function(hexValue) {
    return ('00000' + (hexValue | 0).toString(16)).substr(-6);
  },


  /**
   * arrayToHexString - Convert intArray  to human readable hex values
   *
   * @param  {uint32array} pixelData The array to convert
   * @return {type}           description
   */
  arrayToHexString: function(pixelData){

    var hexColorArray = {};

    for( pixel = 0; pixel < pixelData.length; pixel++){
      hexColorArray[pixel] =  this.hexToHexString(pixelData[pixel]);
    }

    return hexColorArray;

  }

};


module.exports.colorHelper = colorHelper;
