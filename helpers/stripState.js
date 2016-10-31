/* jshint node: true */

var ws281x = require('rpi-ws281x-native');
var colorHelper = require('../helpers/colorHelper').colorHelper;
/** Class representing a light strip object. */
class StripState    {


    /**
     * Create the object
     * @param  {booelan} power    -    description
     * @param  {number} brightness  - description
     * @param  {string} selectedMode - The selected mode ex. effects/ scene
     * @param  {string} modeType  -   The type of mode ex. breathe/ intense
     * @param  {string} activeState - Is the mode active
     * @param  {string} location  -  Where the light is located
     * @param  {string} strandType - The type of strand to control
     */
    constructor(power, num_leds, brightness, selectedMode, modeType, activeState, location = 'Living Room', strandType = 'ws2812'){
      this._numLEDS = num_leds;
      this._power = power;
      this._brightness = Math.min(Math.max(parseInt(brightness), 0), 255);
      this._mode = {};
      this._mode.selectedMode = selectedMode;
      this._mode.modeType = modeType;
      this._mode.activeState = activeState;
      this._strand_type = strandType;
      this._location = location;
      this.pixelData = new Uint32Array(num_leds);
      this.intializeStrand(this._numLEDS);

      //this._interval = interval;
    }

    intializeStrand(num_leds){
      ws281x.init(num_leds);
    }

    reset(){
      ws281x.reset();
    }

    render(){
      ws281x.render(this.pixelData);
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
     * @param  {number} brightness brightness value of strand 0-255
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

    /**
     *
    /**
     * toJSON - Custom serilze method
     *
     * @return {object}  The stripState object to json
     */

    toJSON () {
        var result = {};
        for (var x in this) {

            if (x !== 'interval' ) {
                result[x] = this[x];
            }
            if (x === 'pixelData' ) {
                result[x] = colorHelper.arrayToHexString(this[x]);
            }
        }
        return result;
    }



}

module.exports.StripState = StripState;
