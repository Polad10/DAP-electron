var dt = require('../lib/datetime').datetime;

class Appointment
{
    static getAll(callback)
    {
        const db = require('./db').db.connect();

        db.serialize(function() {
            var query = `SELECT appointment.*, treatment.diagnosis, patient.first_name, patient.last_name
                        FROM appointment
                        INNER JOIN treatment
                        ON appointment.treatment_id = treatment.id
                        INNER JOIN patient
                        ON treatment.patient_id = patient.id
                        ORDER BY appointment.date, appointment.time`;

            db.all(query, (err, rows) => {
                rows = rows ? rows : [];
                callback(err, rows);
            });

            db.close();
        });
    }

    static getForDate(datetime, callback)
    {
        let date = dt.toDateString(datetime);

        const db = require('./db').db.connect();

        db.serialize(function() {
            let query = `SELECT appointment.*, treatment.diagnosis, treatment.id treatment_id, 
                            patient.id patient_id, patient.first_name, patient.last_name
                        FROM appointment
                        INNER JOIN treatment
                        ON appointment.treatment_id = treatment.id
                        INNER JOIN patient
                        ON treatment.patient_id = patient.id
                        WHERE appointment.date = '${date}'
                        AND appointment.status = 'Expected'
                        ORDER BY appointment.time`;

            db.all(query, (err, rows) => {
                rows = rows ? rows : [];
                callback(err, rows);
            });

            db.close();
        });
    }

    static insert(datetime, treatment_id, actions, callback)
    {   
        let date = dt.toDateString(datetime);
        let time = dt.toTimeString(datetime);
        
        const db = require('./db').db.connect();
        
        let query = `INSERT INTO appointment (date, time, treatment_id, actions) 
                     VALUES ('${date}', '${time}', ${treatment_id}, '${actions}')`;

        db.serialize(function() {
            db.run(query, callback);

            db.close();
        });
    }

    static cancel(appointmentID, callback)
    {
        this.updateStatus(appointmentID, 'Cancelled', callback);
    }

    static finish(appointmentID, callback)
    {
        this.updateStatus(appointmentID, 'Finished', callback);
    }

    static updateStatus(appointmentID, status, callback)
    {
        const db = require('./db').db.connect();

        let query = `UPDATE appointment
                    SET status = '${status}'
                    WHERE id = ${appointmentID}`;

        db.serialize(function() {
            db.run(query, callback);

            db.close();
        });
    }
}

exports.Appointment = Appointment;