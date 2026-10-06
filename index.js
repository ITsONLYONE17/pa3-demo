//Libraries
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const { check, validationResult } = require('express-validator');

const app = express();

app.use(express.json());

app.post("/api/sensor", (req, res) => {
    console.log(req.body);
    res.json({
        message: "Sensor data received"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
