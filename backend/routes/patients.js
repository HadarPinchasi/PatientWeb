// Import required dependencies
const express = require("express");
const db = require("../database");

// Initialize Express router
const router = express.Router();

// Define GET endpoint to retrieve all patient outcomes
router.get("/", (req, res) => {
    // Query database for all outcomes, ordered by patient ID and timestamp
    db.all(
        `SELECT patient_id, outcome, upload_datetime, is_current 
         FROM outcomes
         ORDER BY patient_id, upload_datetime DESC`,
        [],
        (err, rows) => {
            // Handle database errors
            if (err) return res.status(500).json({ error: err.message });
            
            // Transform database results to API response format
            const patientsData = rows.map(row => ({
                patient_id: row.patient_id,
                outcome: row.outcome,
                timestamp: row.upload_datetime,
                latest: row.is_current === 1
            }));
            
            // Send JSON response with patient data
            res.json(patientsData);
            }
    );
});

module.exports = router;