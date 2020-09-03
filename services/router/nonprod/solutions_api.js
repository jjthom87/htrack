var router = require('express').Router();
var fs = require('fs');
var path = require('path');

const sheets = require('./../../../google_sheets/google_sheets_api.js');

var solutionsService = require('./../../../services/controller/nonprod/solutions_service.js');

router.get('/api/solution', solutionsService.getAllSolutions);

router.put('/api/solution', (req,res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    sheets.authorize(JSON.parse(content), (auth) => {
        solutionsService.main(auth, req, res);
    });

  });
});

module.exports = router;
