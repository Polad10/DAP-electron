class Payment
{
    static getAll(callback)
    {
        const db = require('./db').db.connect();

        db.serialize(function() {
            var query = `SELECT payment.*, patient.first_name, patient.last_name
                        FROM payment
                        INNER JOIN visit
                        ON payment.visit_id = visit.id
                        INNER JOIN treatment
                        ON visit.treatment_id = treatment.id
                        INNER JOIN patient
                        ON treatment.patient_id = patient.id`;

            db.all(query, (err, rows) => {
                rows = rows ? rows : [];
                callback(err, rows);
            });

            db.close();
        });
    }

    static insert(amount, visitID, callback)
    {
        const db = require('./db').db.connect();

        db.serialize(function() {
            let query = `INSERT INTO payment (amount, visit_id)
                        VALUES (${amount}, ${visitID})`;

            db.run(query, callback);
            
            db.close();
        });
    }
}

exports.Payment = Payment;