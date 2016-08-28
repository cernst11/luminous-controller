"use strict";

class StripState {
    /**
     * constructor - Default constructor for the object
     *
     * @param  {booelan} power        description
     * @param  {number} brightness   description
     * @param  {string} selectedMode The selected mode ex. effects/ scene
     * @param  {string} modeType     The type of mode ex. breathe/ intense
     * @param  {string} activeState  Is the mode active
     */
    constructor(power, brightness, selectedMode, modeType, activeState){
      this.power = power;
      this.brightness = Math.min(Math.max(parseInt(brightness), 0), 255);
      this.mode = {};
      this.mode.selectedMode = selectedMode;
      this.mode.modeType = modeType;
      this.mode.activeState = activeState;

    }


    /**
     * setBrightness - Set the bnightness field
     *
     * @param  {number} brightness description
     */
    setBrightness(brightness){
      //force it to be between 0 and 255
      this.brightness = Math.min(Math.max(parseInt(brightness), 0), 255);
    }


    /**
     * setMode - Helper method to set the strip mode properties
     *
     * @param  {string} selectedMode The selected mode ex. effects/ scene
     * @param  {string} modeType     The type of mode ex. breathe/ intense
     * @param  {string} activeState  Is the mode active
     */
    setMode(selectedMode, modeType, activeState){
      this.mode.selectedMode = selectedMode;
      this.mode.modeType = modeType;
      this.mode.activeState = activeState;
    }

};

module.exports.StripState = StripState;
