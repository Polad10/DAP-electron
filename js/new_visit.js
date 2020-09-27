try
{
    var Patient = require('./db_models/patient').Patient;
}
catch(ex) {}

try
{
    var Treatment = require('./db_models/treatment').Treatment;
}
catch(ex) {}

try
{
    var Visit = require('./db_models/visit').Visit;
}
catch(ex) {}

try
{
    var Payment = require('./db_models/payment').Payment;
}
catch(ex) {}

var patientDropdown = undefined;
var treatmentDropdown = undefined;
var submitSubscribers = [];

var patientDropdownReady = false;
var treatmentDropdownReady = false;

function handleAddPatientBtnClick() {
    SetNewPatientForm(!$('#patient_dropdown').prop('disabled'));
    $("#add_patient_content").transition("slide", "500ms");
}

function handleAddTreatmentBtnClick() {
    SetNewTreatmentForm(!$('#treatment_dropdown').prop('disabled'));
    $("#add_treatment_content").transition("slide", "500ms");
}

function initialize() {
    $('#visit_modal').modal({ onApprove: () => false, detachable: false }).modal('show');

    $("#new_patient_btn").on("click", handleAddPatientBtnClick);
    $("#new_treatment_btn").on("click", handleAddTreatmentBtnClick);

    $('#dob_calendar').calendar({ type: 'date', startMode: 'year' });
    $('#start_date_calendar').calendar({ type: 'date' });
    $('#end_date_calendar').calendar({ type: 'date' });
    $('#visit_calendar').calendar();

    $('#new_visit_form').form(
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
}

function initializePatientDropdown() {
    patientDropdownReady = false;

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
            }).dropdown({ showOnFocus: false, onChange: handlePatientDropdownChange, forceSelection: false });
        
        if(rows.length > 0)
        {
            patientDropdownReady = true;
        }
    });
}

function initializeTreatmentDropdown(patientID) {
    treatmentDropdownReady = false;

    Treatment.getPatientTreatments(patientID, (err, rows) => {
        let values = rows.map(r => {
            let name = `${r.first_name} ${r.last_name}: ${r.diagnosis}`;

            return { name: name, value: r.id };
        })

        treatmentDropdown = $('#treatment_dropdown').dropdown(
            {
                placeholder: 'Select treatment . . .',
                clearable: true,
                forceSelection: false,
                showOnFocus: false
            }).dropdown('change values', values);
        
        if(rows.length > 0)
        {
            treatmentDropdownReady = true;
        }
    });
}

function handlePatientDropdownChange(value, text, choice) {
    initializeTreatmentDropdown(value);
}

function handleSubmit(e, fields) {
    e.preventDefault();

    let paymentCallback = function (err) {
        if(fields.payment)
        {
            CreatePayment(this.lastID, fields, function (err) {
                notifySubscribers();
            });
        }
        else
        {
            notifySubscribers();
        }
    };

    if (fields.patient) {
        if (fields.treatment) {
            CreateVisit(fields.treatment, fields, paymentCallback);
        }
        else {
            CreateTreatment(fields.patient, fields, function (err) {
                CreateVisit(this.lastID, fields, paymentCallback);
            });
        }
    }
    else {
        CreatePatient(fields, function (err) {
            CreateTreatment(this.lastID, fields, function (err) {
                CreateVisit(this.lastID, fields, paymentCallback);
            });
        });
    }

    $('#visit_modal').modal('hide');
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

function SetNewTreatmentForm(state) {
    if (treatmentDropdown) {
        treatmentDropdown.dropdown('clear');
    }

    SetFieldState($('#treatment_dropdown'), !state);

    SetFieldState($('input[name="start_date"]'), state);
    SetFieldState($('input[name="end_date"]'), state);
    SetFieldState($('textarea[name="diagnosis"]'), state);
    SetFieldState($('input[name="phone_nr"]'), state);
    SetFieldState($('textarea[name="extra_info"]'), state);
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

function CreatePayment(visitID, fields, callback) {
    let amount = fields.payment ? parseFloat(fields.payment).toFixed(2) : '';

    Payment.insert(amount, visitID, callback);
}

function CreateVisit(treatmentID, fields, callback) {
    let datetime = new Date(fields.date);
    let actions = fields.actions;

    Visit.insert(treatmentID, datetime, actions, callback);
}

function CreateTreatment(patientID, fields, callback) {
    let startDate = new Date(fields.start_date);
    let endDate = fields.end_date ? new Date(fields.end_date) : '';
    let diagnosis = fields.diagnosis;
    let extraInfo = fields.extra_info;

    Treatment.insert(patientID, startDate, endDate, diagnosis, extraInfo, callback);
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

function setVisitFormValues(patientID, treatmentID, actions, datetime)
{
    setPatientDropdownValue(patientID);
    setTreatmentDropdownValue(treatmentID);
    $('textarea[name="actions"]').val(actions);
    $('#visit_calendar').calendar('set date', datetime);
}

function setPatientDropdownValue(value)
{
    if(patientDropdownReady)
    {
        patientDropdown.dropdown('set exactly', value);
    }
    else
    {
        setTimeout(() => {
            setPatientDropdownValue(value);
        }, 250);
    }
}

function setTreatmentDropdownValue(value)
{
    if(treatmentDropdownReady)
    {
        treatmentDropdown.dropdown('set exactly', value);
    }
    else
    {
        setTimeout(() => {
            setTreatmentDropdownValue(value);
        }, 250);
    }
}

function subscribeToVisitSubmit(onSubmit)
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