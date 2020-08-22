var dt = require('../lib/datetime').datetime;

class Patient
{
    static insert(first_name, last_name, city, extra_info, dob, phone_nr, callback)
    {
        let dobString = dt.toDateString(dob);

        const db = require('./db').db.connect();

        db.serialize(function() {
            db.run(`INSERT INTO patient VALUES (NULL, '${first_name}', '${last_name}', '${city}', 
                                                '${extra_info}','${dobString}', '${phone_nr}')`, callback);

            db.close();
        });
    }

    static getAll(callback)
    {
        const db = require('./db').db.connect();

        db.serialize(function() {
            var query = `SELECT *
                        FROM patient`;

            db.all(query, (err, rows) => {
                rows = rows ? rows : [];
                callback(err, rows);
            });

            db.close();
        });
    }
}

exports.Patient = Patient;