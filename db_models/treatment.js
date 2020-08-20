class Treatment
{
    static getPendingPayments(callback)
    {
        const db = require('./db').db.connect();

        db.serialize(function() {
            var query = `SELECT treatment.id , patient.first_name, patient.last_name, treatment.name as treatment_name,
                                ROUND(TOTAL(product.total_price) - TOTAL(payment.amount), 2) as pending_payment
                        FROM treatment
                        INNER JOIN patient
                        ON treatment.patient_id = patient.id
                        LEFT OUTER JOIN product
                        ON product.treatment_id = treatment.id
                        LEFT OUTER JOIN visit
                        ON visit.treatment_id = treatment.id
                        LEFT OUTER JOIN payment
                        ON payment.visit_id = visit.id
                        GROUP BY treatment.id, patient.first_name, patient.last_name, treatment_name
                        HAVING (TOTAL(product.total_price) - TOTAL(payment.amount)) > 0`;

            db.all(query, (err, rows) => {
                rows = rows ? rows : [];
                callback(err, rows);
            });

            db.close();
        });
    }

    static getPatientTreatments(id, callback)
    {
        const db = require('./db').db.connect();

        db.serialize(function() {
            var query = `SELECT *
                        FROM treatment
                        INNER JOIN patient
                        ON treatment.patient_id = patient.id
                        WHERE patient.id = ${id}`;

            db.all(query, (err, rows) => {
                rows = rows ? rows : [];
                callback(err, rows);
            });

            db.close();
        });
    }

    static getAll(callback)
    {
        const db = require('./db').db.connect();

        db.serialize(() => {
            let query = `SELECT t.id, t.name, t.start_date, t.diagnosis, p.first_name, p.last_name, 
                            TOTAL(pr.total_price) as total_price, TOTAL(pa.amount) as paid
                        FROM treatment t
                        INNER JOIN patient p
                        ON t.patient_id = p.id
                        LEFT OUTER JOIN product pr
                        ON pr.treatment_id = t.id
                        LEFT OUTER JOIN visit v
                        ON v.treatment_id = t.id
                        LEFT OUTER JOIN payment pa
                        ON pa.visit_id = v.id
                        GROUP BY t.id, t.name, t.start_date, t.diagnosis, p.first_name, p.last_name
                        ORDER BY t.start_date DESC`

            db.all(query, (err, rows) => {
                rows = rows ? rows : [];
                callback(err, rows);
            });
        });
    }
}

exports.Treatment = Treatment;