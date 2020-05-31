connect = function()
{
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/t.db');

    return db;
}

exports.connect = connect;