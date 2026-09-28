const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', verifyToken, (req, res) => {
  db.all('SELECT * FROM employees ORDER BY firstName, lastName', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
});

router.post('/', verifyToken, (req, res) => {
  const { firstName, lastName, email, department, position } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required' });
  }

  const id = uuidv4();

  db.run(
    `INSERT INTO employees (id, firstName, lastName, email, department, position)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, firstName, lastName, email, department || '', position || ''],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      return res.status(201).json({ id, firstName, lastName, email, department, position });
    }
  );
});

module.exports = router;