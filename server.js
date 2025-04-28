const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./database.db');

db.run(`CREATE TABLE IF NOT EXISTS ads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL
)`);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ads', (req, res) => {
  db.all('SELECT * FROM ads ORDER BY id DESC LIMIT 10', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/ads', (req, res) => {
  const { title, content } = req.body;
  db.run('INSERT INTO ads (title, content) VALUES (?, ?)', [title, content], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

app.delete('/ads/:id', (req, res) => {
  db.run('DELETE FROM ads WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/add.html'));
});

app.listen(3000, () => console.log('Сервер запущено на http://localhost:3000'));
