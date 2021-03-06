var router = require('express').Router();
var fs = require('fs');
var path = require('path');

const sheets = require('./../../../google_sheets/google_sheets_api.js');

var eventsService = require('./../../../services/controller/nonprod/events_service.js');

router.get('/api/event', eventsService.getAllEvents);

router.put('/api/event', (req,res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    sheets.authorize(JSON.parse(content), (auth) => {
        eventsService.main(auth, req, res);
    });

  });
});

module.exports = router;
