const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const db = require("../database");

// Initialize Express router
const router = express.Router();
// Define constants
const UPLOAD_FOLDER = "uploads/";
const REQUIRED_COLUMNS = ["Patient ID", "Outcome"];

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_FOLDER)) fs.mkdirSync(UPLOAD_FOLDER);

// Configure multer for file uploads with CSV validation
const upload = multer({
    dest: UPLOAD_FOLDER,
    fileFilter: (req, file, cb) => {
        // Only allow CSV files
        if (path.extname(file.originalname).toLowerCase() !== ".csv") {
            return cb(new Error("Only CSV files are allowed"));
        }
        cb(null, true);
    },
});

/**
 * Validates CSV content structure and data
 * @param {Array} results - Parsed CSV data
 * @param {Array} headers - CSV headers
 * @returns {Array} List of validation errors, empty if valid
 */
function validateCSV(results, headers) {
    const errors = [];
    const normalizedHeaders = headers.map(header => header.trim());

    // Check that CSV has exactly the required columns
    if (!REQUIRED_COLUMNS.every(col => normalizedHeaders.includes(col)) || normalizedHeaders.length !== 2) {
        return ["CSV file must contain exactly 'Patient ID' and 'Outcome' columns"];
    }

    // Validate each row in the CSV
    results.forEach((row, index) => {
        // Check for empty rows
        if (Object.values(row).every(value => value.trim() === "")) {
            errors.push(`Row ${index + 1} is empty`);
        }
        // Check column count
        if (Object.keys(row).length > 2) {
            errors.push(`Row ${index + 1} contains more than 2 columns`);
        }
        // Check for required values
        REQUIRED_COLUMNS.forEach(column => {
            if (!row[column] || row[column].trim() === ""|| row[column] === null) {
                errors.push(`Missing value in '${column}' at row ${index + 1}`);
            }
        });
        // Validate Patient ID is numeric
        if (!/^\d+$/.test(row["Patient ID"].trim())) {
            errors.push(`Invalid 'Patient ID' at row ${index + 1}: Must be a number`);
        }
    });

    return errors;
}

/**
 * Marks previous outcomes for a patient as non-current
 * @param {string} patientId - The patient's ID
 * @returns {Promise} Resolves when update completes
 */
function updateOldOutcomes(patientId) {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE outcomes SET is_current = FALSE WHERE patient_id = ? AND is_current = TRUE`,
            [patientId],
            (err) => (err ? reject(err) : resolve())
        );
    });
}

/**
 * Inserts a new current outcome for a patient
 * @param {string} patientId - The patient's ID
 * @param {string} outcome - The outcome value
 * @returns {Promise} Resolves when insert completes
 */
function insertNewOutcome(patientId, outcome) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO outcomes (patient_id, outcome, is_current) VALUES (?, ?, TRUE)`,
            [patientId, outcome],
            (err) => (err ? reject(err) : resolve())
        );
    });
}

/**
 * Saves all outcomes from CSV to database in a transaction
 * @param {Array} results - Parsed CSV data
 * @returns {Promise} Resolves when all data is saved
 */
async function saveResultsToDatabase(results) {
    return new Promise((resolve, reject) => {
        db.serialize(async () => {
            // Start transaction for atomicity
            db.run("BEGIN TRANSACTION");
            try {
                for (const row of results) {
                    // For each row, update existing records then insert new one
                    await updateOldOutcomes(row["Patient ID"]);
                    await insertNewOutcome(row["Patient ID"], row["Outcome"]);
                }

                // Commit transaction if all operations succeed
                db.run("COMMIT", (err) => {
                    if (err) {
                        db.run("ROLLBACK");
                        return reject("Database error: failed to commit transaction");
                    }
                    resolve();
                });
            } catch (error) {
                // Rollback on any error
                db.run("ROLLBACK");
                reject(error);
            }
        });
    });
}

// Define POST endpoint for file upload
router.post("/", (req, res) => {
    upload.single("file")(req, res, async (err) => {
        // Handle file upload errors
        if (err) return res.status(400).json({ error: err.message });
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const filePath = req.file.path;
        const results = [];
        
        // Process CSV file stream
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("headers", (headers) => (req.headersCsv = headers))
            .on("data", (row) => results.push(row))
            .on("end", async () => {
                // Validate CSV content
                const errors = validateCSV(results, req.headersCsv);
                if (errors.length) {
                    // Clean up invalid file and return errors
                    fs.unlinkSync(filePath);
                    return res.status(400).json({ errors });
                }
                try {
                    // Save valid data to database
                    await saveResultsToDatabase(results);
                    res.json({ message: "File uploaded and data saved successfully!" });
                } catch (error) {
                    res.status(500).json({ error: error.toString() });
                } finally {
                    // Always clean up the uploaded file
                    fs.unlinkSync(filePath);
                }
            })
            .on("error", (err) => res.status(500).json({ error: err.message }));
    });
});

module.exports = router;