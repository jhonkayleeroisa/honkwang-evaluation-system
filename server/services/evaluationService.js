const { v4: uuidv4 } = require('uuid');
const db = require('../db/connection');
const { sendEmail } = require('./emailService');

const generateEvaluationToken = () => uuidv4();

const sendEvaluationEmails = async (assignmentId, cycleId, evaluatorId, employeeId, token) => {
  const query = `
    SELECT a.*,
      e.firstName AS evaluatorFirstName,
      e.lastName AS evaluatorLastName,
      e.email AS evaluatorEmail,
      emp.firstName AS employeeFirstName,
      emp.lastName AS employeeLastName,
      ec.name AS cycleName
    FROM evaluation_assignments a
    INNER JOIN evaluators e ON a.evaluatorId = e.id
    INNER JOIN employees emp ON a.employeeId = emp.id
    INNER JOIN evaluation_cycles ec ON a.evaluationCycleId = ec.id
    WHERE a.id = ?
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [assignmentId], async (err, assignment) => {
      if (err) return reject(err);
      if (!assignment) return reject(new Error('Assignment not found'));

      const evaluationLink = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/#/evaluation/${token}`;
      const subject = `Evaluation Request: ${assignment.employeeFirstName} ${assignment.employeeLastName}`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Performance Evaluation Request</h2>
          <p>Hello ${assignment.evaluatorFirstName} ${assignment.evaluatorLastName},</p>
          <p>You have been assigned to evaluate ${assignment.employeeFirstName} ${assignment.employeeLastName}.</p>
          <p>Please complete the evaluation here:</p>
          <p><a href="${evaluationLink}">Complete Evaluation</a></p>
        </div>
      `;

      try {
        const emailResult = await sendEmail({
          to: assignment.evaluatorEmail,
          subject,
          html,
          text: `Evaluation link: ${evaluationLink}`
        });

        resolve(emailResult);
      } catch (error) {
        reject(error);
      }
    });
  });
};

module.exports = { generateEvaluationToken, sendEvaluationEmails };