/**
 * Helper class for colors
 */
var colorHelper =  {

  /**
   * fadeColor - Calculate the color intermediate colors between to hex values using hsl transform
   *
   * @param  {Integer} startHex The starting hex value
   * @param  {Integer} endHex   The ending hex value
   * @param  {Integer} steps    The number of steps btween the two points
   * @return {Array}            Array of new values
   */
  fadeColor : function(startHex, endHex, steps){

      var tinyColor = require("tinycolor2");

      //convert the integer to a value timy color can use
      startHex = startHex.toString(16).replace("0x", "");
      endHex = endHex.toString(16).replace("0x", "");

      //pad the hex values
      startHex = colorHelper.padHex(startHex);
      endHex = colorHelper.padHex(endHex);


      var color1 = tinyColor(startHex);
      var color2 = tinyColor(endHex);
      var startHsl = color1.toHsl();
      var endHsl = color2.toHsl();

      //Calculate the amount to increment by on each led
      var hueStepValue  = (endHsl.h - startHsl.h)/steps;
      var satStepValue  = (endHsl.s - startHsl.s)/steps;
      var lumStepValue  = (endHsl.l - startHsl.l)/steps;
      var hexStepArray = [];
      var x = [hueStepValue,  satStepValue, lumStepValue];

      //increment hsl value anc covert back to hex
      for(i=1; i<=steps; i++ ){

        var h = startHsl.h + (hueStepValue * i);
        var s = startHsl.s + (satStepValue * i);
        var l = startHsl.l + (lumStepValue * i);
        var hsl = {h: h, s : s , l: l };

        var newColor = tinyColor(hsl);
        hexStepArray[i-1]= (newColor.toHex());


      }
      return hexStepArray;
  },



   /**
    * rgb2Int - Convert rgb value to integer
    *
    * @param  {Integer} r Red integer value
    * @param  {Integer} g Green integer value
    * @param  {Integer} b Blue integer value
    * @return {Integer}   The integer(HEX) value of the RGB value
    */
   rgb2Int : function(r, g, b) {
      return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
  },


  /**
   * anonymous function - Pad the hex string
   *
   * @param  {String} hexValue The current HEX value
   * @return {String}          The padded string HEX value
   */
  padHex : function (hexValue){
    while(hexValue.length< 6){
      hexValue = '0' +  hexValue ;
    }
    return hexValue;
  }

};


module.exports.colorHelper = colorHelper;
