var router = require('express').Router();
var fs = require('fs');
var path = require('path');

const sheets = require('./../../../google_sheets/google_sheets_api.js');

var diseaseDiagnosticsSolutionController = require('./../../../services/controller/prod/solutions/disease_diagnostic_solution_service.js');
var medicalSuppliesController = require('./../../../services/controller/prod/solutions/medical_supplies_solution_service.js');
var patientTreatmentSolutionController = require('./../../../services/controller/prod/solutions/patient_treatment_solution_service.js');
var softwareSolutionController = require('./../../../services/controller/prod/solutions/software_solution_service.js');
var vaccineSolutionController = require('./../../../services/controller/prod/solutions/vaccine_solution_service.js');

router.put('/api/solutions/disease-diagnostics', (req,res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    const sheetsResponse = sheets.authorize(JSON.parse(content), diseaseDiagnosticsSolutionController.saveDiseaseDiagnosticsSolution);

    res.status(200).json({success: true})
  });
});

router.get('/api/solutions/disease-diagnostics', diseaseDiagnosticsSolutionController.getDiseaseDiagnosticsSolution);

router.put('/api/solutions/software', (req,res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    const sheetsResponse = sheets.authorize(JSON.parse(content), softwareSolutionController.saveSoftwareSolution);

    res.status(200).json({success: true})
  });
});

router.get('/api/solutions/software', softwareSolutionController.getSoftwareSolution);

router.put('/api/solutions/patient-treatment', (req, res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    const sheetsResponse = sheets.authorize(JSON.parse(content), patientTreatmentSolutionController.savePatientTreatmentSolution);

    res.status(200).json({success: true})
  });
})

router.get('/api/solutions/patient-treatment', patientTreatmentSolutionController.getPatientTreatmentSolution);

//

router.put('/api/solutions/medical-supplies', (req, res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    const sheetsResponse = sheets.authorize(JSON.parse(content), medicalSuppliesController.saveMedicalSuppliesSolution);

    res.status(200).json({success: true})
  });
})

router.get('/api/solutions/medical-supplies', medicalSuppliesController.getVaccineSolution);

//

router.put('/api/solutions/vaccines', (req, res) => {
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      res.json({success: false, error: err})
    }

    const sheetsResponse = sheets.authorize(JSON.parse(content), vaccineSolutionController.saveVaccineSolution);

    res.status(200).json({success: true})
  });
});

router.get('/api/solutions/vaccines', vaccineSolutionController.getMedicalSuppliesSolution);

module.exports = router;
