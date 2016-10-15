'use strict';
let express = require('express');
let router = express.Router();

router.get('/all', function(req, res) {

    let stripState = req.app.get('stripState');
    res.json({
        stripState: stripState
    });

}).get('/pixeldata', function(req, res){

  let stripState = req.app.get('stripState');

  res.json({
      pixelData: stripState.pixelData
  });
}).get('/power', function(req, res){

  let stripState = req.app.get('stripState');

  res.json({
      power: stripState.power
  });
}).get('/strand', function(req, res){

  let stripState = req.app.get('stripState');

  res.json({
      strandType: stripState._strand_type
  });
}).get('/strand', function(req, res){

  let stripState = req.app.get('stripState');

  res.json({
      strandType: stripState._strand_type
  });
}).get('/mode', function(req, res){

  let stripState = req.app.get('stripState');

  res.json({
      mode: stripState._mode
  });
}).get('/numleds', function(req, res){

  let stripState = req.app.get('stripState');

  res.json({
      num_leds: stripState._numLEDS
  });

}).get('/location', function(req, res){

  let stripState = req.app.get('stripState');

  res.json({
      mode: stripState._location
  });
});

module.exports = router;
