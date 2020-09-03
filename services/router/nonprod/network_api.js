var router = require('express').Router();
var fs = require('fs');
var path = require('path');

const sheets = require('./../../../google_sheets/google_sheets_api.js');

var networkService = require('./../../../services/controller/nonprod/network_service.js');

router.get('/api/network', networkService.getAllNetworkRecords);

router.put('/api/network', (req,res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    sheets.authorize(JSON.parse(content), (auth) => {
      networkService.main(auth, req, res);
    });

  });
});

router.put('/api/network/join', networkService.mainJoin);

module.exports = router;
