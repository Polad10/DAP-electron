try { var Treatment = require('./db_models/treatment').Treatment }
catch (ex) { }

try { var Product = require('./db_models/product').Product }
catch (ex) { }

try { var Patient = require('../db_models/patient').Patient; }
catch(ex) {}

function CreateTreatment(patientID, fields, callback) {
    let startDate = new Date(fields.start_date);
    let endDate = fields.end_date ? new Date(fields.end_date) : '';
    let diagnosis = fields.diagnosis;
    let extraInfo = fields.extra_info;

    Treatment.insert(patientID, startDate, endDate, diagnosis, extraInfo, callback);
}

function CreateProduct(treatmentID, name, totalAmount, quantity) {
    Product.insert(name, totalAmount, quantity, treatmentID);
}

function CreatePatient(fields, callback)
{
  let firstName = fields.first_name;
  let lastName = fields.last_name;
  let city = fields.city;
  let patientExtra = fields.patient_extra_info;
  let dob = new Date(fields.dob);
  let phoneNr = fields.phone_nr;

  Patient.insert(firstName, lastName, city, patientExtra, dob, phoneNr, callback);
}

exports.field_manager = {
    CreateTreatment: CreateTreatment,
    CreateProduct: CreateProduct,
    CreatePatient: CreatePatient
}