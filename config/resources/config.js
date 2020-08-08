var fs = require('fs');
var path = require('path');
const aws = require('aws-sdk');

const s3 = new aws.S3();
const BUCKET = process.env.S3_BUCKET_NAME;

const logger = require('./../logging/logger.js');

exports.setResourceFiles = () => {
  var secretsFiles = ["token.json", "application.json", "credentials.json"];
  secretsFiles.forEach((file) => {
    if (!fs.existsSync(path.join(__dirname + '/../../resources/', file))) {
      s3.getObject({
        Bucket: BUCKET,
        Key: file
      }, (err, data) => {
        if (err) logger.error(err);
        fs.writeFileSync(path.join(__dirname + '/../../resources/', file), data.Body);
        logger.info(`Resource File ${file} Set`)
      });
    }
  });
}

exports.checkForResourceFileUpdates = () => {
  const props = require('./../../resources/application.json');
  if(fs.existsSync(path.join(__dirname + '/../../resources/', 'application.json'))){
    s3.getObject({
      Bucket: BUCKET,
      Key: "application.json"
    }, (err, data) => {
      if (err) console.error(err);
      if(JSON.stringify(JSON.parse(data.Body.toString())) != JSON.stringify(props)){
        var params = {Bucket: BUCKET, Key: "application.json", Body: ''};
        var fileStream = fs.createReadStream(path.join(__dirname + '/../../resources/', 'application.json'));
        fileStream.on('error', function(err) {
          logger.error('File Error', err);
        });
        params.Body = fileStream;

        s3.upload(params, function(err, data) {
          if(err){
            logger.error("Error uploading updated application.json")
          } else {
            logger.info("Uploaded updated application.json successfully")
          }
        });
      }
    });
  }
}
