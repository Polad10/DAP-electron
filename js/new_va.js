var Patient = require('./db_models/patient').Patient;
var Treatment = require('./db_models/treatment').Treatment;
var Visit = require('./db_models/visit').Visit;
var Appointment = require('./db_models/appointment').Appointment;

var patientDropdown;
var treatmentDropdown;

function handleAddPatientBtnClick() 
{
  SetNewPatientForm(!$('#patient_dropdown').prop('disabled'));
  $("#add_patient_content").transition("slide", "500ms");
}

function handleAddTreatmentBtnClick() 
{
  SetNewTreatmentForm(!$('#treatment_dropdown').prop('disabled'));
  $("#add_treatment_content").transition("slide", "500ms");
}

function initialize()
{
  $("#new_patient_btn").on("click", handleAddPatientBtnClick);
  $("#new_treatment_btn").on("click", handleAddTreatmentBtnClick);

  $('#dob_calendar').calendar({type: 'date', startMode: 'year'});
  $('#start_date_calendar').calendar({type: 'date'});
  $('#end_date_calendar').calendar({type: 'date'});
  $('#va_calendar').calendar();

  $('#new_va_form').form(
    {
      fields: 
      {
        patient: 'empty',
        first_name: 'empty',
        last_name: 'empty',
        dob: 'empty',
        treatment: 'empty',
        start_date: 'empty',
        diagnosis: 'empty',
        va_date: 'empty'
      },
      onSuccess: handleNewVASubmit
    });

  initializePatientDropdown();
  initializeTreatmentDropdown();

  SetNewPatientForm(false);
  SetNewTreatmentForm(false);
}

function initializePatientDropdown()
{
  Patient.getAll((err, rows) => {
    let values = rows.map(r => {
      let name = `${r.first_name} ${r.last_name}`;

      return {name: name, value: r.id};
    });

    patientDropdown = $('#patient_dropdown').dropdown(
      {
        placeholder: 'Select patient . . . ', 
        values: values,
        clearable: true            
      }).dropdown({onChange: handlePatientDropdownChange, forceSelection: false});
  });
}

function initializeTreatmentDropdown(patientID)
{
  Treatment.getPatientTreatments(patientID, (err, rows) => {
    let values = rows.map(r => {
      let name = `${r.first_name} ${r.last_name}: ${r.diagnosis}`;

      return {name: name, value: r.id};
    })
    
    treatmentDropdown = $('#treatment_dropdown').dropdown(
                              {
                                placeholder: 'Select treatment . . .',
                                clearable: true,
                                forceSelection: false
                              }).dropdown('change values', values);
  });
}

function handlePatientDropdownChange(value, text, choice)
{
  initializeTreatmentDropdown(value);
}

function handleNewVASubmit(e, fields)
{
  e.preventDefault();

  if(fields.patient)
  {
    if(fields.treatment)
    {
      CreateVA(fields.treatment, fields);
    }
    else
    {
      CreateTreatment(fields.patient, fields, function(err) {
        CreateVA(this.lastID, fields);
      });
    }
  }
  else
  {
    CreatePatient(fields, function(err) {
      CreateTreatment(this.lastID, fields, function(err) {
        CreateVA(this.lastID, fields);
      });
    });
  }

  $('#new_va_modal').modal('hide');
}

function SetNewPatientForm(state)
{
  if(patientDropdown) 
  {
    patientDropdown.dropdown('clear');
  }
  SetFieldState($('#patient_dropdown'), !state);

  SetFieldState($('input[name="first_name"]'), state);
  SetFieldState($('input[name="last_name"]'), state);
  SetFieldState($('input[name="city"]'), state);
  SetFieldState($('input[name="dob"]'), state);
  SetFieldState($('input[name="phone_nr"]'), state);
  SetFieldState($('textarea[name="patient_extra_info"]'), state);
}

function SetNewTreatmentForm(state)
{
  if(treatmentDropdown)
  {
    treatmentDropdown.dropdown('clear');
  }
  SetFieldState($('#treatment_dropdown'), !state);

  SetFieldState($('input[name="start_date"]'), state);
  SetFieldState($('input[name="end_date"]'), state);
  SetFieldState($('textarea[name="diagnosis"]'), state);
  SetFieldState($('input[name="phone_nr"]'), state);
  SetFieldState($('textarea[name="extra_info"]'), state);
}

function SetFieldState(field, state)
{
  if(state)
  {
    field.prop('disabled', false);
    field.closest('.field').removeClass('disabled');
  }
  else
  {
    field.prop('disabled', true);
    field.closest('.field').addClass('disabled');
  }
}

function CreateVA(treatmentID, fields)
{
  let vaName = $('#new_va_form').data('name');
  let datetime = new Date(fields.va_date);
  let actions = fields.actions;

  if(vaName == "appointment")
  {
    Appointment.insert(datetime, treatmentID, actions);
  }
  else if(vaName == "visit")
  {
    Visit.insert(treatmentID, datetime, actions);
  }
}

function CreateTreatment(patientID, fields, callback)
{
  let startDate = new Date(fields.start_date);
  let endDate = fields.end_date ? new Date(fields.end_date) : '';
  let diagnosis = fields.diagnosis;
  let extraInfo = fields.extra_info;

  Treatment.insert(patientID, startDate, endDate, diagnosis, extraInfo, callback);
}

function CreatePatient(fields, callback)
{
  let firstName = fields.first_name;
  let lastName = fields.last_name;
  let city = fields.city;
  let patientExtra = fields.extra_info;
  let dob = new Date(fields.dob);
  let phoneNr = fields.phone_nr;

  Patient.insert(firstName, lastName, city, patientExtra, dob, phoneNr, callback);
}

initialize();
