try { var field_manager = require('./js/common/field_manager').field_manager; }
catch(ex) {}

var submitSubscribers = [];

function initialize() {
    $('#new_patient_form').load('./modals/static/patient_fields.html', () => {
        $('#patient_modal').modal({ onApprove: () => false, detachable: false }).modal('show');

        $('#dob_calendar').calendar({type: 'date', startMode: 'year'});
        $('#new_patient_form').form({onSuccess: handleNewPatientSubmit}).form('set auto check');
    });
}

function handleNewPatientSubmit(e, fields) {
    e.preventDefault();

    field_manager.CreatePatient(fields, function(err) {
        notifySubscribers();
    });

    $('#patient_modal').modal('hide');
}

function subscribeToPatientSubmit(onSubmit)
{
    submitSubscribers.push(onSubmit);
}

function notifySubscribers()
{
    for(let i = 0; i < submitSubscribers.length; i++)
    {
        submitSubscribers[i]();
    }
}

initialize();