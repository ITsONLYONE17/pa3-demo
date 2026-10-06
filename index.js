//Libraries
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const { check, validationResult } = require('express-validator');

const app = express();

app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} (${req.get('content-type') || 'no content-type'})`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let connection = null;

async function query(sql, params) {
    //Singleton DB connection
    if (null === connection) {
        console.log('Here');
        connection = await mysql.createConnection({
            host: "student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com",
            user: "DONOVANRAMIREZ",
            password: "utpMeBEuZ0D8gRpUsu3zpaI7wh5jFq6X5oQ",
            database: 'DONOVANRAMIREZ'
        });
    }
    const [results, ] = await connection.execute(sql, params);
    return results;
}

app.post("/pa3", async (req, res) => {
    const rawPotValue = req.body && req.body.pot_val;
    console.log("[POST /pa3] received pot_val:", rawPotValue);

    const pot_val = typeof rawPotValue === 'number'
        ? rawPotValue
        : typeof rawPotValue === 'string' && rawPotValue.trim() !== ''
            ? Number(rawPotValue)
            : NaN;

    if (!Number.isFinite(pot_val)) {
        return res.status(400).json({
            error: "pot_val must be a finite number"
        });
    }

    try {
        const result = await query(
            'INSERT INTO pa3 (pot_val) VALUES (?)',
            [pot_val]
        );

        res.status(201).json({
            message: "Sensor data saved",
            id: result.insertId,
            pot_val
        });
    } catch (error) {
        console.error("Failed to save sensor data:", error);
        res.status(500).json({
            error: "Failed to save sensor data"
        });
    }
});




app.listen(3000, () => {
    console.log("Server running on port 3000");
});
