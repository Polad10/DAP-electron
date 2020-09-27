try { var Patient = require('./db_models/patient').Patient }
catch (ex) {}

try { var validation = require('./js/common/validation').validation }
catch (ex) {}

try { var Product = require('./db_models/product').Product }
catch (ex) {}

var patientDropdown = undefined;

function initialize() {
  $('#treatment_modal').modal({ onApprove: () => false, detachable: false }).modal('show');

  $('#dob_calendar').calendar({ type: 'date', startMode: 'year' });
  $('#start_date_calendar').calendar({ type: 'date' });
  $('#end_date_calendar').calendar({ type: 'date' });

  initializePatientDropdown();

  $('#new_treatment_form').form({
    onSuccess: handleSubmit
  }).form('set auto check');

  SetNewPatientForm(false);

  $('#new_patient_btn').on("click", handleAddPatientBtnClick);
  $('#add_product_btn').on('click', handleAddProductBtnClick);
  $('#products').on('click', 'button[class~=remove]', handleRemoveProductBtnClick);
}

function handleSubmit(e, fields) {
  e.preventDefault();

  let productCallback = function(err) {
    $('#products .product_row').each((index, row) => {
      let productName = $(row).data('product_name');
      let totalAmount = $(row).data('total_amount');
      let quantity = $(row).data('quantity');
  
      CreateProduct(this.lastID, productName, totalAmount, quantity);
    });
  }

  if(fields.patient)
  {
    CreateTreatment(fields.patient, fields, productCallback);
  }
  else
  {
    CreatePatient(fields, function(err) {
      CreateTreatment(this.lastID, fields, productCallback);
    });
  }

  $('#treatment_modal').modal('hide');
}

function initializePatientDropdown() {
  Patient.getAll((err, rows) => {
    let values = rows.map(r => {
      let name = `${r.first_name} ${r.last_name}`;

      return { name: name, value: r.id };
    });

    patientDropdown = $('#patient_dropdown').dropdown(
      {
        placeholder: 'Select patient . . . ',
        values: values,
        clearable: true,
      }).dropdown({ showOnFocus: false, forceSelection: false });
  });
}

function SetNewPatientForm(state) {
  if (patientDropdown) {
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

function SetFieldState(field, state) {
  if (state) {
    field.prop('disabled', false);
    field.closest('.field').removeClass('disabled');
  }
  else {
    field.prop('disabled', true);
    field.closest('.field').addClass('disabled');
  }
}

function handleAddPatientBtnClick() {
  SetNewPatientForm(!$('#patient_dropdown').prop('disabled'));
  $("#add_patient_content").transition("slide", "500ms");
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

function CreatePatient(fields, callback) {
  let firstName = fields.first_name;
  let lastName = fields.last_name;
  let city = fields.city;
  let patientExtra = fields.patient_extra_info;
  let dob = new Date(fields.dob);
  let phoneNr = fields.phone_nr;

  Patient.insert(firstName, lastName, city, patientExtra, dob, phoneNr, callback);
}

function CreateTreatment(patientID, fields, callback) {
  let startDate = new Date(fields.start_date);
  let endDate = fields.end_date ? new Date(fields.end_date) : '';
  let diagnosis = fields.diagnosis;
  let extraInfo = fields.extra_info;

  Treatment.insert(patientID, startDate, endDate, diagnosis, extraInfo, callback);
}

function CreateProduct(treatmentID, name, totalAmount, quantity)
{
  Product.insert(name, totalAmount, quantity, treatmentID);
}

initialize();
