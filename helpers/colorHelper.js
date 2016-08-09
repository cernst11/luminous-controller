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
      console.log(startHex);


      startHex = ('00000' + (startHex | 0).toString(16)).substr(-6);
      endHex = ('00000' + (endHex | 0).toString(16)).substr(-6);



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
    * rgb2Int - Convert rgb value to hex integer
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
   * anonymous function - Convert hex Int to hex String
   *
   * @param  {String} hexValue The current HEX value
   * @return {String}          The padded string HEX value
   */
  hexToHexString : function (hexValue){
    return ('00000' + (hexValue | 0).toString(16)).substr(-6);
  }

};


module.exports.colorHelper = colorHelper;
