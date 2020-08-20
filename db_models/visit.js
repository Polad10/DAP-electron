class Visit
{
    static getAll(callback)
    {
        const db = require('./db').db.connect();

        db.serialize(function() {
            var query = `SELECT visit.*, patient.first_name, patient.last_name
                        FROM visit
                        INNER JOIN treatment
                        ON visit.treatment_id = treatment.id
                        INNER JOIN patient
                        ON treatment.patient_id = patient.id
                        ORDER BY visit.date DESC, visit.time DESC`;

            db.all(query, callback)

            db.close();
        });
    }
}

exports.Visit = Visit;