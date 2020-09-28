try { var Patient = require('./db_models/patient').Patient; }
catch(ex) {}

try { var Treatment = require('./db_models/treatment').Treatment; }
catch(ex) {}

try { var Appointment = require('./db_models/appointment').Appointment; }
catch(ex) {}

try { var Product = require('./db_models/product').Product }
catch (ex) {}

try { var validation = require('./js/common/validation').validation }
catch (ex) {}

var patientDropdown = undefined;
var treatmentDropdown = undefined;
var submitSubscribers = [];

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
  $('#appointment_modal').modal({ onApprove: () => false, detachable: false }).modal('show');

  $('#dob_calendar').calendar({type: 'date', startMode: 'year'});
  $('#start_date_calendar').calendar({type: 'date'});
  $('#end_date_calendar').calendar({type: 'date'});
  $('#appointment_calendar').calendar();

  $('#new_appointment_form').form(
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
        date: 'empty'
      },
      onSuccess: handleSubmit
    });

  initializePatientDropdown();
  initializeTreatmentDropdown();

  SetNewPatientForm(false);
  SetNewTreatmentForm(false);

  $("#new_patient_btn").on("click", handleAddPatientBtnClick);
  $("#new_treatment_btn").on("click", handleAddTreatmentBtnClick);
  $('#add_product_btn').on('click', handleAddProductBtnClick);
  $('#products').on('click', 'button[class~=remove]', handleRemoveProductBtnClick);
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
      }).dropdown({showOnFocus: false, onChange: handlePatientDropdownChange, forceSelection: false});
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
                                forceSelection: false,
                                showOnFocus: false
                              }).dropdown('change values', values);
  });
}

function handlePatientDropdownChange(value, text, choice)
{
  initializeTreatmentDropdown(value);
}

function handleAddProductBtnClick() {
  if(validateProductFields())
  {
    let productName = $('input[name="product_name"]').val();
    let amount = Number($('input[name="amount"]').val());
    let quantity = Number($('input[name="quantity"]').val());
    let totalAmount = Number((amount * quantity).toFixed(2));

    $('#products')
      .append($('<div>', {'class': 'item'})
        .append($('<div>', {'class': 'right floated content'})
          .append($('<button>', {'class': 'remove ui compact tertiary icon button', 'type': 'button'})
            .append($('<i>', {'class': 'red window close outline large icon'}))))
        .append($('<div>', {'class': 'content product_row'})
          .data('product_name', productName)
          .data('total_amount', totalAmount)
          .data('quantity', quantity)
          .append($('<div>', {'class': 'header'}).text(`${productName}`)
            .append($('<i>').text(` (x ${quantity})`)))
          .append($('<div>', {'class': 'description'})
            .append($('<b>')).text(`₼ ${totalAmount}`)))
      );

      $('input[name="product_name"]').val('');
      $('input[name="amount"]').val('');
      $('input[name="quantity"]').val('');
  }
}

function handleRemoveProductBtnClick(e)
{
  $(this).closest('.item').remove();
}

function validateProductFields()
{
  return validateProductNameField() & validateAmountField() & validateQuantityField();
}

function validateProductNameField()
{
  let productNameField = $('input[name="product_name"]');

  if(validation.validateNonEmpty(productNameField))
  {
    fieldError(productNameField, false);

    return true;
  }

  fieldError(productNameField, true);

  return false;
}

function validateAmountField()
{
  let amountField = $('input[name="amount"]');

  if(validation.validateNumber(amountField, 0))
  {
    fieldError(amountField, false);

    return true;
  }
  
  fieldError(amountField, true);

  return false;
}

function validateQuantityField()
{
  let quantityField = $('input[name="quantity"]');

  if(validation.validateNumber(quantityField, 1))
  {
    fieldError(quantityField, false);

    return true;
  }

  fieldError(quantityField, true);

  return false;
}

function fieldError(field, state)
{
  if(state)
  {
    field.closest('.field').addClass('error');
  }
  else
  {
    field.closest('.field').removeClass('error');
  }
}

function handleSubmit(e, fields)
{
  e.preventDefault();

  let appointmentCallback = function(err) {
    notifySubscribers();
  }

  let treatmentCallback = function(err) {
    $('#products .product_row').each((index, row) => {
      let productName = $(row).data('product_name');
      let totalAmount = $(row).data('total_amount');
      let quantity = $(row).data('quantity');
  
      CreateProduct(this.lastID, productName, totalAmount, quantity);
    });

    CreateAppointment(this.lastID, fields, appointmentCallback);
  }

  if(fields.patient)
  {
    if(fields.treatment)
    {
      CreateAppointment(fields.treatment, fields, appointmentCallback);
    }
    else
    {
      CreateTreatment(fields.patient, fields, treatmentCallback);
    }
  }
  else
  {
    CreatePatient(fields, function(err) {
      CreateTreatment(this.lastID, fields, treatmentCallback);
    });
  }

  $('#appointment_modal').modal('hide');
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

function CreateAppointment(treatmentID, fields, callback)
{
  let datetime = new Date(fields.date);
  let actions = fields.actions;
  
  Appointment.insert(datetime, treatmentID, actions, callback);
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
  let patientExtra = fields.patient_extra_info;
  let dob = new Date(fields.dob);
  let phoneNr = fields.phone_nr;

  Patient.insert(firstName, lastName, city, patientExtra, dob, phoneNr, callback);
}

function CreateProduct(treatmentID, name, totalAmount, quantity)
{
  Product.insert(name, totalAmount, quantity, treatmentID);
}

function subscribeToAppointmentSubmit(onSubmit)
{
  if(onSubmit)
  {
    submitSubscribers.push(onSubmit);
  }
}

function notifySubscribers()
{
  for(let i = 0; i < submitSubscribers.length; i++)
  {
    submitSubscribers[i]();
  }
}

initialize();
