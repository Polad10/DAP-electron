var Treatment = require('./db_models/treatment').Treatment;
var Patient = require('./db_models/patient').Patient;
var Appointment = require('./db_models/appointment').Appointment;

function initialize()
{
    $('#appointment_calendar').calendar();
    $('#new_appointment_form').form({fields: {
        patient: 'empty',
        date: 'empty'
        },
        onSuccess: handleNewAppointmentSubmit
    });

    initializePatientDropdown();
}

function handleNewAppointmentSubmit(e, fields)
{
    e.preventDefault();

    let datetime = new Date(fields.date);
    let patientID = fields.patient;
    let treatmentID = fields.treatment;
    
    Appointment.insert(datetime, treatmentID, patientID);
    $('#appointment_modal').modal('hide');
}

function initializePatientDropdown()
{
    Patient.getAll((err, rows) => {
        let values = rows.map(r => {
            let name = `${r.first_name} ${r.last_name}`;

            return {name: name, value: r.id};
        });

        $('#patient_dropdown').dropdown({placeholder: 'Select Patient . . .', values: values,
                                        clearable: true})
                                .dropdown({onChange: handlePatientDropdownChange, forceSelection: false});
    });
}

function initializeTreatmentDropdown(patientID)
{
    Treatment.getPatientTreatments(patientID, (err, rows) => {
        let values = rows.map(r => {
            return {name: r.name, value: r.id};
        });

        $('#treatment_dropdown').dropdown('clear', true)
                                .dropdown({placeholder: 'Select Treatment . . .', forceSelection: false, 
                                        clearable: true, values: values});
    });
}

function handlePatientDropdownChange(value, text, choice)
{
    initializeTreatmentDropdown(value);
}

initialize();