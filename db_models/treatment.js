class Treatment
{
    static getPendingPayments(callback)
    {
        const db = require('./db').connect();

        db.serialize(function() {
            var query = `SELECT treatment.id , patient.first_name, patient.last_name, treatment.name as treatment_name,
                                ROUND(TOTAL(product.total_price) - TOTAL(payment.amount), 2) as pending_payment
                        FROM treatment
                        INNER JOIN patient
                        ON treatment.patient_id = patient.id
                        INNER JOIN product
                        ON product.treatment_id = treatment.id
                        INNER JOIN visit
                        ON visit.treatment_id = treatment.id
                        INNER JOIN payment
                        ON payment.visit_id = visit.id
                        GROUP BY treatment.id, patient.first_name, patient.last_name, treatment_name
                        HAVING (TOTAL(product.total_price) - TOTAL(payment.amount)) > 0`;

            db.all(query, callback)

            db.close();
        });
    }
}

exports.Treatment = Treatment;