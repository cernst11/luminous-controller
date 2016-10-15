'use strict';
let express = require('express');
let router = express.Router();
let basicScenes = require('../scenes/basicScenes');


router.post('/basicscene', function(req, res) {

    let stripState = req.app.get('stripState');
    clearInterval(stripState.interval);
    basicScenes.basicScence( req.body.scene, stripState, req.body.divisionType, req.body.divisions );
    res.json({
      stripState: stripState,
    });

});

module.exports = router;
