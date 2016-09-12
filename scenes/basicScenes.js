'use strict';
/**
 * Show basic scene by slecting a theme color pallete
 */
var intenseColors=[ 0x00BD9D, 0x1ECE6C, 0x2C97DD, 0x9C56B9, 0xF4CA1A, 0xE87E04, 0xEA4B35, 0xF69E00 , 0xD65400, 0xC33825  ];
var relaxingColors=[0x78A1B5, 0xFEF0C9, 0xFEE3EA, 0xC9AC68, 0x036564, 0xFAB37F, 0x84D9D2];

//Get a random elemtn out of an array
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
};


/**
 * anonymous function - Show  a scene
 *
 * @param  {number} stripState.numLEDS   -  The number of leds
 * @param  {object} pixelData  -  The pixel colors
 * @param  {string} scene      -   The scene to show
 * @param  {number} divisions  -  The number of divisions
 * @param  {string} divisionType - How to go from one divison to the next(Fade or Fixed)
 */
var showScene = function (pixelData, scene,  divisions, stripState, divisionType = 'fixed'){

    //color.color(stripState.numLEDS, pixelData, ws281x, black);

    var colorHelper = require('../helpers/colorHelper').colorHelper;
    var divisionColor;

    var pixelsInDivision = Math.floor(stripState.numLEDS/divisions);

    var selectedScene = {
      intense : intenseColors,
      relaxing : relaxingColors
    };

if(divisionType === 'fixed'  ){
    //keep array pos
    let pixelPos = 0;
    //loop through each divison
    for (let i=0; i<divisions; i++){
        divisionColor = selectedScene[scene].randomElement();
        //for each value in
        for (let j=0; j<pixelsInDivision; j++){
            pixelData[pixelPos] = divisionColor;
            pixelPos++;
        }
    }

  }else{

    let  pixelPos = 0;
    let divisionColorArray = [];

    //Get the number of divisions
    for (let i=0; i<divisions+1; i++){
        divisionColor = selectedScene[scene].randomElement();
        divisionColorArray.push(divisionColor);
    }

    //loop through each divisons and calculate the intermediate values between the colors using hsl transform
    for(let k = 0; k<=divisions-1 ; k++){

      var newArr = colorHelper.fadeColor(divisionColorArray[k], divisionColorArray[k+1],(pixelsInDivision -1));
      //make sure to show the first color in the division
      pixelData[pixelPos] = divisionColorArray[k];
      pixelPos++;
      for (let j=0; j<newArr.length; j++){
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

  stripState.render(pixelData);
  stripState.setMode('scene', 'basicScence', 'started');

};

module.exports.basicScence = showScene;
