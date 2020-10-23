const dt = require('../lib/datetime').datetime;

class Visit {
    static getAll(callback) {
        const db = require('./db').db.connect();

        db.serialize(function () {
            let query = `SELECT visit.*, treatment.*, patient.first_name, 
                            patient.last_name, IFNULL(payment.amount, '') as amount
                        FROM visit
                        INNER JOIN treatment
                        ON visit.treatment_id = treatment.id
                        INNER JOIN patient
                        ON treatment.patient_id = patient.id
                        LEFT OUTER JOIN payment
                        ON visit.id = payment.visit_id
                        ORDER BY visit.date DESC, visit.time DESC`;

            db.all(query, (err, rows) => {
                rows = rows ? rows : [];
                callback(err, rows);
            });

            db.close();
        });
    }

    static getForDate(datetime, callback) {
        const db = require('./db').db.connect();

        db.serialize(function () {
            let date = dt.toDateString(datetime);

            let query = `SELECT visit.*, treatment.diagnosis, patient.first_name, 
                            patient.last_name, IFNULL(payment.amount, '') as amount
                        FROM visit
                        INNER JOIN treatment
                        ON visit.treatment_id = treatment.id
                        INNER JOIN patient
                        ON treatment.patient_id = patient.id
                        LEFT OUTER JOIN payment
                        ON visit.id = payment.visit_id
                        WHERE visit.date = '${date}'
                        ORDER BY visit.time DESC`;

            db.all(query, (err, rows) => {
                rows = rows ? rows : [];
                callback(err, rows);
            });

            db.close();
        });
    }

    static insert(treatmentID, datetime, actions, callback) {
        const db = require('./db').db.connect();

        db.serialize(function () {
            let date = dt.toDateString(datetime);
            let time = dt.toTimeString(datetime);

            let query = `INSERT INTO visit 
                        VALUES (NULL, ${treatmentID}, '${date}', '${time}', '${actions}')`;

            db.run(query, callback);

            db.close();
        });
    }
}

exports.Visit = Visit;