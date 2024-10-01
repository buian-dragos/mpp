const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Middleware for validation
function validatePlayer(req, res, next) {
    const { name, shirt_no, height, weight, photo, position, isTitular, description } = req.body;
    if (!name || typeof name !== 'string' ||
        !shirt_no || typeof shirt_no !== 'number' ||
        !height || typeof height !== 'number' ||
        !weight || typeof weight !== 'number' ||
        !position || typeof position !== 'string' ||
        typeof isTitular !== 'boolean' ||
        !description || typeof description !== 'string') {
        return res.status(400).send('Invalid input');
    }
    next();
}

// Routes
app.post('/players', validatePlayer, async (req, res) => {
    const { name, shirt_no, height, weight, photo, position, isTitular, description } = req.body;
    try {
        const { data, error } = await supabase
            .from('player')
            .insert({ name, shirt_no, height, weight, photo, position, isTitular, description })
            .select();

        if (error) {
            console.error('Error adding player:', error.message);
            return res.status(500).send('Error adding player');
        }

        res.status(201).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/players', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('player')
            .select('*');

        if (error) {
            console.error('Error fetching players:', error.message);
            return res.status(500).send('Error fetching players');
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
});

app.put('/players/:id', validatePlayer, async (req, res) => {
    const { id } = req.params;
    const { name, shirt_no, height, weight, photo, position, isTitular, description } = req.body;

    try {
        const { data, error } = await supabase
            .from('player')
            .update({ name, shirt_no, height, weight, photo, position, isTitular, description })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating player:', error.message);
            return res.status(500).send('Error updating player');
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
});

app.delete('/players/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('player')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting player:', error.message);
            return res.status(500).send('Error deleting player');
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
});

// Serve the server
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;

describe('GET /players', () => {
    it('should fetch all players', async () => {
        const response = await request(app).get('/players');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});