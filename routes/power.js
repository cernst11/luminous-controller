'use strict';
let express = require('express');
let router = express.Router();
let power = require('../effects/power').power;


router.post('/toggle', function(req, res) {
    let stripState = req.app.get('stripState');
    let previousStateArray = req.app.get('previousStateArray');

    let toPower = false;
    if (stripState.power) {
        let colorArray = power.setPower('off', stripState);
        req.app.set('previousStateArray', colorArray);
    } else {
        toPower = true;
        power.setPower('on', stripState, previousStateArray);
    }
    res.json({
        stripState: power.powerResponse(toPower, stripState),
    });

}).post('/on', function(req, res) {
    let stripState = req.app.get('stripState');
    let previousStateArray = req.app.get('previousStateArray');

    power.setPower('on', stripState, previousStateArray);
    res.json({
        stripState: power.powerResponse('on', stripState),
    });

}).post('/off', function(req, res) {
    let stripState = req.app.get('stripState');
    let colorArray = power.setPower('off', stripState);
    
    req.app.set('previousStateArray', colorArray);
    res.json({
        stripState: power.powerResponse('off', stripState),
    });

});

module.exports = router;
