/**
 * Created by ernst on 7/16/16.
 */

var intenseColors=[ 0x4B2E7E, 0xD21D1C, 0x004D9F, 0xEAB239, 0x12CE79, 0xDC209B];
var relaxingColors=[0x78A1B5, 0xFEF0C9, 0xFEE3EA, 0xC9AC68, 0x036564, 0xFAB37F, 0x84D9D2];

var color = require('../effects/color');

//Get a random elemtn out of an array
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
};


var showScene = function (num_leds, pixelData, ws281x, scene,  divisions, divisionType){

     divisionType = (typeof divisionType  ==='undefined') ? (fixed) : divisionType;
    //color.color(num_leds, pixelData, ws281x, black);

    var colorHelper = require('../helpers/colorHelper').colorHelper;


    var divisionColor;

    var pixelsInDivision = Math.floor(num_leds/divisions);
    var remainder = num_leds % divisions;

    var selectedScene = {
      intense : intenseColors,
      relaxing : relaxingColors
    };

if(divisionType !== 'fade'  ){
    //keep array pos
    var pixelPos = 0;
    //loop through each divison
    for (i=0; i<divisions; i++){
        divisionColor = selectedScene[scene].randomElement();
        //for each value in
        for (j=0; j<pixelsInDivision; j++){
            pixelData[pixelPos] = divisionColor;
            pixelPos++;
        }
    }

  }else{

    var pixelPos = 0;
    var divisionColorArray = [];

    //Get the number of divisions
    for (i=0; i<divisions+1; i++){
        divisionColor = selectedScene[scene].randomElement();
        divisionColorArray.push(divisionColor);
    }

    //loop th rough each divisons and calculate the intermediate values between the colors using hsl transform
    for(k = 0; k<=divisions-1 ; k++){

      var newArr = colorHelper.fadeColor(divisionColorArray[k], divisionColorArray[k+1],(pixelsInDivision -1));
      //make sure to show the first color in the division
      pixelData[pixelPos] = divisionColorArray[k];
      pixelPos++;
      for (j=0; j<newArr.length; j++){
          var newColor = parseInt(newArr[j], 16);

          //append any leading 0s
          while(newColor.length< 6){
            newColor = '0' +  newColor ;
          }

          pixelData[pixelPos] = newColor;

          pixelPos++;
      }

      //make sure to show the last color in the pixel division
      pixelData[pixelPos] = divisionColorArray[k+1];


    }



  }

    ws281x.render(pixelData);


}

module.exports.basicScence = showScene;
