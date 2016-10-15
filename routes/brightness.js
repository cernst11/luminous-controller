'use strict';
let express = require('express');
let router = express.Router();


router.post('/', function(req, res) {

  let stripState = req.app.get('stripState');
  stripState.brightness = req.body.brightness;

  res.json({
      stripState: stripState
  });

}).get('/', function(req, res){
  let stripState = req.app.get('stripState');

  res.json({
      brightness: stripState.brightness
  });

});

module.exports = router;
