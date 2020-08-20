class Patient
{
    static insert(first_name, last_name, dob, phone_nr)
    {
        const db = require('./db').db.connect();

        db.serialize(function() {
            db.run(`CREATE TABLE IF NOT EXISTS patient 
                    (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, dob TEXT, phone_nr TEXT)`);

            db.run(`INSERT INTO patient VALUES (NULL, '${first_name}', '${last_name}', '${dob}', '${phone_nr}')`);

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