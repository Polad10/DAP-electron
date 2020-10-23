try { var Patient = require('./db_models/patient').Patient }
catch (ex) {}

try { var field_manager = require('./js/common/field_manager').field_manager; }
catch(ex) {}

var patientDropdown = undefined;
var submitSubscribers = [];

function initialize() {
  $('#add_patient_content').load('./modals/static/patient_fields.html', () => {
    $('#add_treatment_content').load('./modals/static/treatment_fields.html', () => {
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
    });
  });
}

function handleSubmit(e, fields) {
  e.preventDefault();

  let productCallback = function(err) {
    $('#products .product_row').each((index, row) => {
      let productName = $(row).data('product_name');
      let totalAmount = $(row).data('total_amount');
      let quantity = $(row).data('quantity');
  
      field_manager.CreateProduct(this.lastID, productName, totalAmount, quantity);
    });

    notifySubscribers();
  }

  if(fields.patient)
  {
    field_manager.CreateTreatment(fields.patient, fields, productCallback);
  }
  else
  {
    field_manager.CreatePatient(fields, function(err) {
      field_manager.CreateTreatment(this.lastID, fields, productCallback);
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

function subscribeToTreatmentSubmit(onSubmit)
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
