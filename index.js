//Libraries
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const { check, validationResult } = require('express-validator');

const app = express();

app.use(express.json());

app.post("/pa3", (req, res) => {
    console.log(req.body);
    res.json({
        message: "Sensor data received"
    });
});

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



app.listen(3000, () => {
    console.log("Server running on port 3000");
});
