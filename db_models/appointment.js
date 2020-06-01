class Appointment
{
    static getAll(callback)
    {
        const db = require('./db').connect();
        const currentDate = new Date();
        const currentDateString = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}}`;

        db.serialize(function() {
            var query = `SELECT appointment.*, patient.first_name, patient.last_name, treatment.name as treatment_name
                        FROM appointment
                        INNER JOIN patient
                        ON appointment.patient_id = patient.id
                        INNER JOIN treatment
                        ON appointment.treatment_id = treatment.id
                        WHERE appointment.date >= '${currentDateString}'
                        ORDER BY appointment.date, appointment.time`;

            db.all(query, callback)

            db.close();
        });
    }
}

exports.Appointment = Appointment;