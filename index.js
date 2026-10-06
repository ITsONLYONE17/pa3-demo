const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let connectionPromise;

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

app.post('/pa3/', async (request, response) => {
    const body = request.body;
    const rawPotValue = typeof body === 'number'
        ? body
        : body?.potval ?? body?.potVal ?? body?.pot_val;

    if (
        (typeof rawPotValue !== 'number' && typeof rawPotValue !== 'string') ||
        (typeof rawPotValue === 'string' && rawPotValue.trim() === '')
    ) {
        return response.status(400).json({ message: 'A numeric potval value is required' });
    }

    const potValue = Number(rawPotValue);
    if (!Number.isFinite(potValue)) {
        return response.status(400).json({ message: 'A numeric potval value is required' });
    }

    try {
        const result = await query(
            'INSERT INTO pa3 (pot_val) VALUES (?)',
            [potValue]
        );

        return response.status(201).json({
            message: 'Potval added',
            id: result.insertId
        });
    } catch (error) {
        console.error('Failed to insert potval:', error);
        return response.status(500).json({ message: 'Failed to save potval' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
