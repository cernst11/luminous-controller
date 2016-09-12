/* jshint node: true */

var ws281x = require('rpi-ws281x-native');

class StripState    {


    /**
     * constructor - Default constructor for the object
     *
     * @param  {booelan} power        description
     * @param  {number} brightness   description
     * @param  {string} selectedMode The selected mode ex. effects/ scene
     * @param  {string} modeType     The type of mode ex. breathe/ intense
     * @param  {string} activeState  Is the mode active
     */
    constructor(power, num_leds, brightness, selectedMode, modeType, activeState, strandType = 'ws2812'){
      this._numLEDS = num_leds;
      this._power = power;
      this._brightness = Math.min(Math.max(parseInt(brightness), 0), 255);
      this._mode = {};
      this._mode.selectedMode = selectedMode;
      this._mode.modeType = modeType;
      this._mode.activeState = activeState;
      this._strand_type = strandType;
      this.intializeStrand(this._numLEDS);
    }

    intializeStrand(num_leds){
      ws281x.init(num_leds);
    }

    reset(){
      ws281x.reset();
    }

    render(pixelData){
      ws281x.render(pixelData);
    }


    /**
     * set - Power
     *
     * @param  {boolean} power Power true | false
     */
    set power(power){
      this._power = power;
    }


    get power (){
      return this._power;
    }


    /**
     * setBrightness - Set the bnightness field
     *
     * @param  {number} brightness description
     */
    set brightness(brightness){
      //force it to be between 0 and 255
      var brightnessValue =  Math.min(Math.max(parseInt(brightness), 0), 255);
      this._brightness = brightnessValue;
      ws281x.setBrightness(brightnessValue);
    }

    get brightness(){
      return this._brightness;
    }


    /**
     * setMode - Helper method to set the strip mode properties
     *
     * @param  {string} selectedMode The selected mode ex. effects/ scene
     * @param  {string} modeType     The type of mode ex. breathe/ intense
     * @param  {string} activeState  Is the mode active
     */
    setMode(selectedMode, modeType, activeState){
      this._mode.selectedMode = selectedMode;
      this._mode.modeType = modeType;
      this._mode.activeState = activeState;
    }

    get numLEDS(){
      return this._numLEDS;
    }

    set numLEDS(NUM_LEDS){
      this._numLEDS = NUM_LEDS;
    }



}

module.exports.StripState = StripState;
