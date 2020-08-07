var router = require('express').Router();
var fs = require('fs');
var path = require('path');

const sheets = require('./../../../google_sheets/api/google_sheets_api.js');

var solutionsController = require('./../../../services/controller/nonprod/solutions_service.js');

router.put('/api/solution', (req,res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    sheets.authorize(JSON.parse(content), (auth) => {
        solutionsController.main(auth, req, res);
    });

  });
});

module.exports = router;
