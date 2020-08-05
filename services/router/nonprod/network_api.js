var router = require('express').Router();
var fs = require('fs');
var path = require('path');

const sheets = require('./../../../google_sheets/api/google_sheets_api.js');

var networkController = require('./../../../services/controller/nonprod/network/network_service.js');

router.put('/api/network', (req,res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    sheets.authorize(JSON.parse(content), (auth) => {
      networkController.main(auth, req, res);
    });

  });
});

router.put('/api/network/join', networkController.mainJoin);

module.exports = router;
