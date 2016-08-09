
var colorHelper = require('../helpers/colorHelper').colorHelper;
var color = require('./color');




function renderBlob = function(pixelData, ws281x){



}


/**
 * var - A movinng section of brighter pixels
 *
 * @param  {Object} ws281x -            The light strip object
 * @param  {Uint32Array} pixelData   -  The pixelData
 * @param  {Integer} color    -         The color to set the strip. If no color is specfied the blob runs against the current colors
 * @param  {Integer} refreshRate  -     How fast should the blob update
 * @return {Object}                     The interval object
 */
var startBlob = function(ws281x, pixelData, color, refreshRate){

  ws281x.setBrightness(128);

  interval = setInterval(function () {


  }, refreshRate);

  return interval;

}

module.exports.startBlob = startBlob;
