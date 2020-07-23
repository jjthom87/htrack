const {google} = require('googleapis');

const props = require('./../../../resources/application.json');
const logger = require('./../../../config/logging/logger.js');

var Network = require('./../../../db/models/prod/Network.model');

const DiseaseDiagnosticsSolution = require('./../../../../db/models/prod/DiseaseDiagnosticsSolution.model');
const MedicalSuppliesSolution = require('./../../../../db/models/prod/MedicalSuppliesSolution.model');
const PatientTreatmentSolution = require('./../../../../db/models/prod/PatientTreatmentSolution.model');
const SoftwareSolution = require('./../../../../db/models/prod/SoftwareSolution.model');
const VaccineSolution = require('./../../../../db/models/prod/VaccineSolution.model');

exports.joinNetworkSolutions = function(req, res, next){
  var totalResults = [];
  let newDDRecords = 0;
  let newSRecords = 0;
  let newPTRecords = 0;
  let newMSRecords = 0;
  let newVRecords = 0;

  DiseaseDiagnosticsSolution.aggregate([
     {
       $lookup:
         {
           from: "networks",
           localField: "developer",
           foreignField: "name",
           as: "network_info"
         }
    },
    {
      $match:
      {
        "network_info":
        {
          $size: 0
        }
      }
    },
    {
      $project:
      {
        'network_info' : 0,
        "_id": 0
      }
    }
  ]).exec(function(err, result) {
     if (err) throw err;
     var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

     resultsNoDuplicates.forEach((a) => {
       newDDRecords++;
       Network.create({
         name: a.developer,
         link: a.link
       });
       totalResults.push(a)
     })
     setTimeout(() => {
       logger.info("Disease Diagnostics Records Added: " + newDDRecords);
     }, 100)
  });

  SoftwareSolution.aggregate([
     {
       $lookup:
         {
           from: "networks",
           localField: "developer",
           foreignField: "name",
           as: "network_info"
         }
    },
    {
      $match:
      {
        "network_info":
        {
          $size: 0
        }
      }
    },
    {
      $project:
      {
        'network_info' : 0,
        "_id": 0
      }
    }
  ]).exec(function(err, result) {
     if (err) throw err;
     var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

     resultsNoDuplicates.forEach((a) => {
       newSRecords++;
       Network.create({
         name: a.developer,
         link: a.link
       });
       totalResults.push(a)
     })
     setTimeout(() => {
       logger.info("Software Records Added: " + newSRecords);
     }, 100)
  });

  PatientTreatmentSolution.aggregate([
     {
       $lookup:
         {
           from: "networks",
           localField: "developer",
           foreignField: "name",
           as: "network_info"
         }
    },
    {
      $match:
      {
        "network_info":
        {
          $size: 0
        }
      }
    },
    {
      $project:
      {
        'network_info' : 0,
        "_id": 0
      }
    }
  ]).exec(function(err, result) {
     if (err) throw err;
     var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

     resultsNoDuplicates.forEach((a) => {
       newPTRecords++;
       Network.create({
         name: a.developer,
         link: a.link
       });
       totalResults.push(a)
     })
     setTimeout(() => {
       logger.info("Patient Treatment Solution Records Added: " + newPTRecords);
     }, 100)
  });

  MedicalSuppliesSolution.aggregate([
     {
       $lookup:
         {
           from: "networks",
           localField: "developer",
           foreignField: "name",
           as: "network_info"
         }
    },
    {
      $match:
      {
        "network_info":
        {
          $size: 0
        }
      }
    },
    {
      $project:
      {
        'network_info' : 0,
        "_id": 0
      }
    }
  ]).exec(function(err, result) {
     if (err) throw err;
     var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

     resultsNoDuplicates.forEach((a) => {
       newMSRecords++;
       Network.create({
         name: a.developer,
         link: a.link
       });
       totalResults.push(a)
     })
     setTimeout(() => {
       logger.info("Medical Supplies Solution Records Added: " + newMSRecords);
     }, 100)
  });

  VaccineSolution.aggregate([
     {
       $lookup:
         {
           from: "networks",
           localField: "developer",
           foreignField: "name",
           as: "network_info"
         }
    },
    {
      $match:
      {
        "network_info":
        {
          $size: 0
        }
      }
    },
    {
      $project:
      {
        'network_info' : 0,
        "_id": 0
      }
    }
  ]).exec(function(err, result) {
     if (err) throw err;
     var resultsNoDuplicates = result.filter((v,i,a)=>a.findIndex(t=>(t.developer === v.developer))===i)

     resultsNoDuplicates.forEach((a) => {
       newVRecords++;
       Network.create({
         name: a.developer,
         link: a.link
       });
       totalResults.push(a)
     })
     setTimeout(() => {
       logger.info("Vaccine Solution Records Added: " + newVRecords);
     }, 100)
  });

  setTimeout(() => {
    res.json({success: true, softwareRecords: newSRecords, diseaseDiagnosticRecords: newDDRecords, patientTreatmentRecords: newPTRecords, medicalSuppliesRecords: newMSRecords, vaccineRecords: newVRecords})
  }, 1000)
}
