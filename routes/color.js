'use strict';
let express = require('express');
let router = express.Router();
let color = require('../effects/color');


router.post('/', function(req, res) {

    let stripState = req.app.get('stripState');
    clearInterval(stripState.interval);
    color.setColor(req.body.color, stripState);

    res.json({
        stripState: stripState
    });

}).get('/', function(req, res){

  let stripState = req.app.get('stripState');

  res.json({
      pixelData: stripState.pixelData
  });
});

module.exports = router;
