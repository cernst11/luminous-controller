'use strict';
let express = require('express');
let router = express.Router();
let rainbow = require('../effects/rainbow');
let breathe = require('../effects/breathe');
let theaterChase = require('../effects/theaterChase');
let rotate = require('../effects/rotate');
let rawColor = require('../effects/raw');
let ease = require('../effects/ease');



router.post('/:effect', function(req, res) {

    let stripState = req.app.get('stripState');
    let previousStateArray = req.app.get('previousStateArray');
    let effect = req.params.effect;

    console.log(req.body);
    clearInterval(stripState.interval);
    stripState.brightness = 255;
    switch (effect) {
      case 'breathe':
        breathe.startBreathe(stripState, req.body.refresh);
        break;
      case 'rainbow':
        rainbow.startRainbow( stripState, req.body.refresh);
        break;
      case 'theaterChase':
        theaterChase.startTheaterChase( stripState, req.body.color, req.body.refresh );
        break;
      case 'rotate':
        rotate.startRotate(stripState,  req.body.refresh, req.body.color, req.body.fillColor,  req.body.lit);
        break;
      case 'rawColor':
        rawColor.raw(req.body.colorString, stripState);
        break;
      case 'raw':
        rawColor.raw(req.body.colorString, stripState);
        break;
       case 'ease' : 
        if(req.body.color === 'previous'){
          ease.startEase(stripState, req.body.ease, previousStateArray);
        }else{
          ease.startEase(stripState, req.body.ease, req.body.color, req.body.refreshRate, req.body.duration);
        }
        break;
      }
     

      res.json({
          stripState: stripState
      });

});

module.exports = router;
