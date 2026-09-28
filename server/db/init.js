const db = require('./connection');
const bcrypt = require('bcryptjs');

const tables = [
  `CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT,
    position TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS evaluators (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS evaluation_cycles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS evaluation_assignments (
    id TEXT PRIMARY KEY,
    evaluationCycleId TEXT NOT NULL,
    evaluatorId TEXT NOT NULL,
    employeeId TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending',
    ratings TEXT,
    comments TEXT,
    submittedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evaluationCycleId) REFERENCES evaluation_cycles(id),
    FOREIGN KEY (evaluatorId) REFERENCES evaluators(id),
    FOREIGN KEY (employeeId) REFERENCES employees(id)
  )`,
  `CREATE TABLE IF NOT EXISTS email_notifications (
    id TEXT PRIMARY KEY,
    evaluationAssignmentId TEXT NOT NULL,
    recipientEmail TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    sentAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evaluationAssignmentId) REFERENCES evaluation_assignments(id)
  )`,
  `CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT,
    lastName TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
];

tables.forEach((sql) => {
  db.run(sql, (err) => {
    if (err) console.error('Create table error:', err.message);
  });
});

const seedAdmin = () => {
  const adminEmail = 'admin@evaluation-system.com';
  const hashedPassword = bcrypt.hashSync('admin123', 8);

  db.get('SELECT * FROM admin_users WHERE email = ?', [adminEmail], (err, row) => {
    if (err) {
      console.error('Seed admin lookup failed:', err.message);
      return;
    }

    if (!row) {
      db.run(
        `INSERT INTO admin_users (id, email, password, firstName, lastName)
         VALUES (?, ?, ?, ?, ?)`,
        ['admin-1', adminEmail, hashedPassword, 'Admin', 'User'],
        (insertErr) => {
          if (insertErr) {
            console.error('Seed admin failed:', insertErr.message);
          } else {
            console.log('Default admin created: admin@evaluation-system.com / admin123');
          }
        }
      );
    }
  });
};

seedAdmin();
module.exports = db;