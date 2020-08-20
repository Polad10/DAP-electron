class Patient
{
    static insert(first_name, last_name, city, extra_info, dob, phone_nr)
    {
        const db = require('./db').db.connect();

        db.serialize(function() {
            db.run(`INSERT INTO patient VALUES (NULL, '${first_name}', '${last_name}', '${city}', 
                                                '${extra_info}','${dob}', '${phone_nr}')`);

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