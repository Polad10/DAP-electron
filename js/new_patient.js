var Patient = require('./db_models/Patient').Patient;

$('#dob_calendar').calendar({type: 'date'});
$('#new_patient_form').form({fields: {
        first_name: 'empty',
        last_name: 'empty'
    },
    onSuccess: handleNewPatientSubmit
});

function handleNewPatientSubmit(e, fields)
{
    e.preventDefault();
    Patient.insert(fields.first_name, fields.last_name, fields.dob, fields.phone_nr);
    $('#patient_modal').modal('hide');
}