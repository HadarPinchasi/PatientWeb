const sqlite3 = require("sqlite3").verbose();

//creating db
const db = new sqlite3.Database("patients.db", (err) => {
    if (err) console.error(err.message);
    console.log("Connected to SQLite database.");
});

// creating table if not exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS outcomes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INT NOT NULL,  
            outcome TEXT NOT NULL,
            upload_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_current BOOLEAN DEFAULT TRUE
        );
    `);
});

module.exports = db;
