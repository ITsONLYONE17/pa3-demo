//Libraries
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const { check, validationResult } = require('express-validator');

const app = express();

app.use(express.json());

app.post("/pa3/", async(req, res) => {
    let result = {};
    
    try {
        const potVal = req.body;

        const insertSql = 'INSERT INTO pa3 (pot_val) VALUES (potVal)';

        const [result,packet] = await query(insertSql, [potVal]);

        result = await query(insertSql, queryParameters);

        response.status(201).json({ message: "Potval Added"});
    }catch (error){
        console.log(error);
        return response.status(500).json({message: "Uh oh"});
    }
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
