const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.text({ type: 'text/plain' }));

let connectionPromise;

async function query(sql, params) {
    if (!connectionPromise) {
        const config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        };
        const missingConfig = Object.entries(config)
            .filter(([, value]) => !value)
            .map(([key]) => key);

        if (missingConfig.length > 0) {
            throw new Error(`Missing database configuration: ${missingConfig.join(', ')}`);
        }

        connectionPromise = mysql.createConnection(config).catch((error) => {
            connectionPromise = undefined;
            throw error;
        });
    }

    const connection = await connectionPromise;
    const [results, ] = await connection.execute(sql, params);
    return results;
}

app.post('/pa3/', async (request, response) => {
    const body = request.body;
    const rawPotValue = typeof body === 'number' || typeof body === 'string'
        ? body
        : body?.potval ?? body?.potVal ?? body?.pot_val;

    if (
        (typeof rawPotValue !== 'number' && typeof rawPotValue !== 'string') ||
        (typeof rawPotValue === 'string' && rawPotValue.trim() === '')
    ) {
        return response.status(400).json({ message: 'A numeric pot value is required' });
    }

    const potValue = Number(rawPotValue);
    if (!Number.isFinite(potValue)) {
        return response.status(400).json({ message: 'A numeric pot value is required' });
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
        console.error('Failed to insert potval:', error.message);
        return response.status(500).json({ message: 'Failed to save potval' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
