const connect = function()
{
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/t.db');

    return db;
}

const initialize = function()
{
    const db = connect();

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS patient 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                first_name TEXT, 
                last_name TEXT, 
                city TEXT,
                extra_info TEXT,
                dob TEXT, 
                phone_nr TEXT)`);

        db.run(`CREATE TABLE IF NOT EXISTS treatment 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                patient_id INTEGER, 
                start_date TEXT, 
                end_date TEXT, 
                diagnosis TEXT, 
                extra_info TEXT, 
                status TEXT DEFAULT 'Ongoing',
                FOREIGN KEY (patient_id) REFERENCES patient(id))`);

        db.run(`CREATE TABLE IF NOT EXISTS appointment 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                date TEXT, 
                time TEXT, 
                treatment_id INTEGER, 
                actions TEXT,
                status TEXT DEFAULT 'Expected',
                FOREIGN KEY (treatment_id) REFERENCES treatment(id))`);

        db.run(`CREATE TABLE IF NOT EXISTS product 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                quantity INTEGER, 
                total_price REAL, 
                treatment_id INTEGER, 
                FOREIGN KEY (treatment_id) REFERENCES treatment(id))`);

        db.run(`CREATE TABLE IF NOT EXISTS visit 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                treatment_id INTEGER, 
                date TEXT, 
                time TEXT, 
                actions TEXT,
                FOREIGN KEY (treatment_id) REFERENCES treatment(id))`);

        db.run(`CREATE TABLE IF NOT EXISTS payment 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                amount REAL, 
                visit_id INTEGER, 
                FOREIGN KEY (visit_id) REFERENCES visit(id))`);
    });
}

exports.db = {
    connect: connect,
    initialize: initialize
};