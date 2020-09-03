var router = require('express').Router();
var fs = require('fs');
var path = require('path');

const sheets = require('./../../../google_sheets/google_sheets_api.js');

var publicationsService = require('./../../../services/controller/nonprod/publications_service.js');

router.get('/api/publication', publicationsService.getAllPublications);

router.put('/api/publication', (req,res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    sheets.authorize(JSON.parse(content), (auth) => {
        publicationsService.main(auth, req, res);
    });

  });
});

module.exports = router;
