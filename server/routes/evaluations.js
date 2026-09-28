const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { generateEvaluationToken, sendEvaluationEmails } = require('../services/evaluationService');

router.get('/cycles', verifyToken, (req, res) => {
  db.all('SELECT * FROM evaluation_cycles ORDER BY startDate DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
});

router.post('/cycles', verifyToken, (req, res) => {
  const { name, description, startDate, endDate } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ error: 'Name, startDate, and endDate are required' });
  }

  const id = uuidv4();

  db.run(
    `INSERT INTO evaluation_cycles (id, name, description, startDate, endDate)
     VALUES (?, ?, ?, ?, ?)`,
    [id, name, description || '', startDate, endDate],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      return res.status(201).json({
        id,
        name,
        description,
        startDate,
        endDate,
        status: 'pending'
      });
    }
  );
});

router.post('/assign', verifyToken, async (req, res) => {
  const { evaluationCycleId, evaluatorId, employeeId } = req.body;

  if (!evaluationCycleId || !evaluatorId || !employeeId) {
    return res.status(400).json({
      error: 'evaluationCycleId, evaluatorId, and employeeId are required'
    });
  }

  const id = uuidv4();
  const token = generateEvaluationToken();

  db.run(
    `INSERT INTO evaluation_assignments (id, evaluationCycleId, evaluatorId, employeeId, token)
     VALUES (?, ?, ?, ?, ?)`,
    [id, evaluationCycleId, evaluatorId, employeeId, token],
    async (err) => {
      if (err) return res.status(400).json({ error: err.message });

      try {
        await sendEvaluationEmails(id, evaluationCycleId, evaluatorId, employeeId, token);
        return res.status(201).json({
          id,
          evaluationCycleId,
          evaluatorId,
          employeeId,
          token,
          status: 'pending'
        });
      } catch (emailErr) {
        return res.status(500).json({
          error: 'Assignment created but email failed: ' + emailErr.message
        });
      }
    }
  );
});

router.get('/token/:token', (req, res) => {
  const sql = `
    SELECT a.*,
      e.firstName AS evaluatorFirstName,
      e.lastName AS evaluatorLastName,
      em.firstName AS employeeFirstName,
      em.lastName AS employeeLastName,
      em.email AS employeeEmail
    FROM evaluation_assignments a
    INNER JOIN evaluators e ON a.evaluatorId = e.id
    INNER JOIN employees em ON a.employeeId = em.id
    WHERE a.token = ?
  `;

  db.get(sql, [req.params.token], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Evaluation not found' });

    return res.json(row);
  });
});

router.post('/submit/:token', (req, res) => {
  const { token } = req.params;
  const { ratings, comments } = req.body;

  if (!ratings) {
    return res.status(400).json({ error: 'Ratings are required' });
  }

  db.run(
    `UPDATE evaluation_assignments
     SET ratings = ?, comments = ?, status = 'submitted', submittedAt = CURRENT_TIMESTAMP
     WHERE token = ?`,
    [JSON.stringify(ratings), comments || '', token],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      return res.json({ message: 'Evaluation submitted successfully' });
    }
  );
});

module.exports = router;