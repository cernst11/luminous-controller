'use strict';
var color = require('./color');


var power =  {

  /**
   *  Set the power on or off
   * @param  {string} toPowerMode description
   * @param  {object} stripState  description
   * @return {type}             description
   */
   setPower: function( toPowerMode, stripState, previousColorArray) {

    clearInterval(stripState.interval);
    //if coming from a a std off

    if (stripState.brightness <= 0 && toPowerMode === 'on') {
      for (var i = 0; i < stripState.numLEDS; i++) {
        stripState.pixelData[i] = previousColorArray[i];
      }
      stripState.render();
      this.fadePowerOn( stripState);

      //If coming from a server restart
    } else if (stripState.brightness === 255 && stripState.power === false) {
      stripState.brightness = 0;
      color.setColor( 0x555555, stripState);
      this.fadePowerOn( stripState);


    } else if (toPowerMode === 'off' && stripState.power === true) {

      var colorArray;
      colorArray = stripState.pixelData.slice(0);
      stripState.interval = setInterval(function() {
        stripState.render();
        if (stripState.brightness <= 0) {
          //stripState.setBrightness(0);
          color.setColor( 0x000000, stripState);
          stripState.power = false;
          stripState.setMode('off', 'off', 'stopped');
          clearInterval(stripState.interval);
        } else {
          stripState.brightness = stripState.brightness - 1;
        }

      }, (60 / 255));
      //brightness 0 is not actually completley off so set to black and return the previous color array
      return colorArray;
    }

  },

  /**
   * var - fade the power on
   *
   * @param  {object} interval   The interval object
   * @param  {object} stripState The state of the strip
   */
   fadePowerOn : function( stripState) {

    stripState.power = true;
    stripState.setMode('on', 'on', 'stopped');

    stripState.interval = setInterval(function() {
      if (stripState.brightness >= 255) {
        clearInterval(stripState.interval);
      } else {
        stripState.brightness = stripState.brightness + 1;
      }
    }, 60 / 255);

  },


   /**
    * powerResponse - Set response for power changes since power fades in and out
    *
    * @param  {object} toPower    change the power mode to 'on or off'
    * @param  {object} stripState The strip object
    * @return {object}            description
    */
   powerResponse : function(toPower, stripState) {

    if (toPower === false) {

      return {
        '_power': false,
        '_brightness': 0,
        '_mode': {
          'selectedMode': 'off',
          'modeType': 'off',
          'activeState': 'stopped'
        },
        '_strand_type': stripState._strandType,
        '_location': stripState._location
      };

    } else {
      return {
        '_power': true,
        '_brightness': 255,
        '_mode': {
          'selectedMode': 'on',
          'modeType': 'on',
          'activeState': 'stopped'
        },
        '_strand_type': stripState._strandType,
        '_location': stripState._location
      };

    }

  }

};


module.exports.power = power;
