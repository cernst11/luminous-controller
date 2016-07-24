var tinyColor = require("tinycolor2");

var colorHelper =  {

  fadeColor : function(startHex, endHex, steps){

    var tinyColor = require("tinycolor2");
      console.log("function Called");
      //convert the integer to a value timy color can use
      startHex = startHex.toString(16).replace("0x", "");
      endHex = endHex.toString(16).replace("0x", "");


      startHsl = tinyColor(startHex).tohsl();
      endHsl = tinyColor(endHex).tohsl();

      var husStepValue  = startHsl.h - endHsl.h/steps;
      var satStepValue  = startHsl.s - endHsl.l/steps;
      var lumStepValue  = startHsl.l - endHsl.v/steps;
      var hexStepArray;

      for(i=1; i<=steps; i++ ){


        var h = startHsl.h + (hueStepValue * i);
        var s = Math.abs(startHsl.s + (satStepValue * i));
        var l = Math.abs(startHsl.l + (lumStepValue * i));
        var hsl = {h: h, s : s , l: l };
        var newColor = tinyColor(hsl);
        hexStepArray.push(newColor.toHex());


      }


      return hexStepArray;
  },


   rgb2Int : function(r, g, b) {
      return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
  }




};


module.exports.colorHelper = colorHelper;
