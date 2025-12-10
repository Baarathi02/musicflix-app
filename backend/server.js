const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://musicflix-app.netlify.app' // Add your Netlify URL here
    ]
}));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes

// GET all songs
app.get('/api/songs', (req, res) => {
    const sql = 'SELECT * FROM songs ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// GET single song
app.get('/api/songs/:id', (req, res) => {
    const sql = 'SELECT * FROM songs WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json(results[0]);
    });
});

// POST create new song
app.post('/api/songs', (req, res) => {
    const { title, artist, album, genre, duration, image_url, release_year } = req.body;
    const sql = 'INSERT INTO songs (title, artist, album, genre, duration, image_url, release_year) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [title, artist, album, genre, duration, image_url, release_year], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, message: 'Song created successfully' });
    });
});

// PUT update song
app.put('/api/songs/:id', (req, res) => {
    const { title, artist, album, genre, duration, image_url, release_year } = req.body;
    const sql = 'UPDATE songs SET title = ?, artist = ?, album = ?, genre = ?, duration = ?, image_url = ?, release_year = ? WHERE id = ?';
    
    db.query(sql, [title, artist, album, genre, duration, image_url, release_year, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json({ message: 'Song updated successfully' });
    });
});

// DELETE song
app.delete('/api/songs/:id', (req, res) => {
    const sql = 'DELETE FROM songs WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json({ message: 'Song deleted successfully' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});