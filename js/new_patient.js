try { var Patient = require('./db_models/Patient').Patient; }
catch(ex) {}

var submitSubscribers = [];

function initialize() {
    $('#patient_modal').modal({ onApprove: () => false, detachable: false }).modal('show');

    $('#dob_calendar').calendar({type: 'date', startMode: 'year'});
    $('#new_patient_form').form({
        fields: {
            first_name: 'empty',
            last_name: 'empty',
            dob: 'empty'
        },
        onSuccess: handleNewPatientSubmit
    });
}

function handleNewPatientSubmit(e, fields) {
    e.preventDefault();

    let firstName = fields.first_name;
    let lastName = fields.last_name;
    let city = fields.city;
    let patientExtra = fields.extra_info;
    let dob = new Date(fields.dob);
    let phoneNr = fields.phone_nr;
  
    Patient.insert(firstName, lastName, city, patientExtra, dob, phoneNr, function(err) {
        notifySubscibers();
    });

    $('#patient_modal').modal('hide');
}

function subscribeToPatientSubmit(onSubmit)
{
    submitSubscribers.push(onSubmit);
}

function notifySubscibers()
{
    for(let i = 0; i < submitSubscribers.length; i++)
    {
        submitSubscribers[i]();
    }
}

initialize();