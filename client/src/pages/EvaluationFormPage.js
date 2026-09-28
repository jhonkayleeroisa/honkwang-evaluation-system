import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const criteria = [
  'Quality of work',
  'Communication',
  'Collaboration',
  'Initiative',
  'Professionalism'
];

function EvaluationFormPage() {
  const { token } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/evaluations/token/${token}`);
        setAssignment(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, [token]);

  const updateRating = (criterion, value) => {
    setRatings((prev) => ({ ...prev, [criterion]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/evaluations/submit/${token}`, { ratings, comments });
      setSubmitted(true);
    } catch (error) {
      alert(error.response?.data?.error || 'Unable to submit evaluation');
    }
  };

  if (!assignment) {
    return <div style={{ padding: 40 }}>Loading evaluation form...</div>;
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
        <div style={{ background: '#dcfce7', color: '#166534', borderRadius: 12, padding: 18 }}>
          Evaluation submitted successfully.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 18, padding: 24, boxShadow: '0 20px 40px rgba(15,23,42,0.08)' }}>
        <h2>Employee evaluation</h2>
        <p><strong>Evaluator:</strong> {assignment.evaluatorFirstName} {assignment.evaluatorLastName}</p>
        <p><strong>Employee:</strong> {assignment.employeeFirstName} {assignment.employeeLastName}</p>

        <form onSubmit={handleSubmit}>
          {criteria.map((criterion) => (
            <div key={criterion} style={{ marginBottom: 18 }}>
              <label>{criterion}</label>
              <select
                value={ratings[criterion] || ''}
                onChange={(e) => updateRating(criterion, e.target.value)}
                required
              >
                <option value="">Select rating</option>
                {[1,2,3,4,5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          ))}

          <div style={{ marginBottom: 18 }}>
            <label>Additional comments</label>
            <textarea rows="6" value={comments} onChange={(e) => setComments(e.target.value)} />
          </div>

          <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 20px', borderRadius: 8, cursor: 'pointer' }}>
            Submit evaluation
          </button>
        </form>
      </div>
    </div>
  );
}

export default EvaluationFormPage;