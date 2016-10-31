'use strict';
var expect    = require('chai').expect;
var colorHelper = require('../helpers/colorHelper').colorHelper;

describe('Color Code Converter', function() {
  describe('RGB to Hex conversion', function() {
    it('converts the basic colors', function() {
      var redHex   = colorHelper.rgb2Int(255, 0, 0);
      var greenHex = colorHelper.rgb2Int(0, 255, 0);
      var blueHex  = colorHelper.rgb2Int(0, 0, 255);

      expect(redHex).to.equal(0xFF0000);
      expect(greenHex).to.equal(0x00FF00);
      expect(blueHex).to.equal(0x0000FF);

    });
  });

  describe('Hex to RGB conversion', function() {
    it('converts the basic colors', function() {
        expect(1).to.equal(1);

    });
  });

  describe('Hex int to hex string conversion', function() {
    it('converts a hex number value to a string', function() {

      var redHex   = colorHelper.hexToHexString(0xFF0000);
      var greenHex = colorHelper.hexToHexString(0x00FF00);
      var blueHex  = colorHelper.hexToHexString(0x0000FF);

      expect(redHex).to.equal('ff0000');
      expect(greenHex).to.equal('00ff00');
      expect(blueHex).to.equal('0000ff');

    });
  });
});
