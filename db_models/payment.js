class Payment
{
    static getAll(callback)
    {
        const db = require('./db').connect();

        db.serialize(function() {
            var query = `SELECT payment.*, patient.first_name, patient.last_name, treatment.name as treatment_name
                        FROM payment
                        INNER JOIN visit
                        ON payment.visit_id = visit.id
                        INNER JOIN treatment
                        ON visit.treatment_id = treatment.id
                        INNER JOIN patient
                        ON treatment.patient_id = patient.id`;

            db.all(query, callback)

            db.close();
        });
    }
}

exports.Payment = Payment;