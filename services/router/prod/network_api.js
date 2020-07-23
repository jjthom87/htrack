var router = require('express').Router();
var fs = require('fs');
var path = require('path');

const sheets = require('./../../../google_sheets/api/google_sheets_api.js');

var networkController = require('./../../../services/controller/prod/network/network_service.js');
var networkJoinController = require('./../../../services/controller/prod/network/network_join_service.js');

router.put('/api/network', (req,res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    const sheetsResponse = sheets.authorize(JSON.parse(content), networkController.saveNetwork);

    res.status(200).json({success: true})
  });
});

router.get('/api/network', networkController.getNetwork);

router.put('/api/network/join', networkJoinController.joinNetworkSolutions);

module.exports = router;
