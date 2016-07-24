var tinycolor = require("tinycolor2");

var colorHelper =  {

  fadeColor : function(startHex, endHex, steps){

      //convert the integer to a value timy color can use
      startHex = startHex.toString(16).replace("0x", "");
      endHex = endHex.toString(16).replace("0x", "");

      while(startHex.length< 6){
        startHex = '0' + startHex ;

      }


      while(endHex.length< 6){
        endHex = '0' +  endHex ;
      }


      var tinyColor = require("tinycolor2");
      var color1 = tinyColor(startHex);
      var color2 = tinyColor(endHex);
      var startHsl = color1.toHsl();
      var endHsl = color2.toHsl();


      var hueStepValue  = (endHsl.h - startHsl.h)/steps;
      var satStepValue  = (endHsl.s - startHsl.s)/steps;
      var lumStepValue  = (endHsl.l - startHsl.l)/steps;
      var hexStepArray = [];
      var x = [hueStepValue,  satStepValue, lumStepValue];

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


   rgb2Int : function(r, g, b) {
      return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
  }


};


module.exports.colorHelper = colorHelper;
