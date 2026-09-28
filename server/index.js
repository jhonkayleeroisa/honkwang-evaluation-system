const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

require('./db/init');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const evaluatorRoutes = require('./routes/evaluators');
const evaluationRoutes = require('./routes/evaluations');

app.use(cors({
  origin: ['http://localhost:3000', 'https://jhonkayleeroisa.github.io'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/evaluators', evaluatorRoutes);
app.use('/api/evaluations', evaluationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});