import React, { useEffect, useState } from 'react';
import api from '../services/api';

function EvaluatorsPage() {
  const [evaluators, setEvaluators] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });

  const loadEvaluators = async () => {
    const res = await api.get('/evaluators');
    setEvaluators(res.data);
  };

  useEffect(() => {
    loadEvaluators();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/evaluators', form);
    setForm({ firstName: '', lastName: '', email: '' });
    loadEvaluators();
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Evaluators</h2>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 20, borderRadius: 16, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div>
            <label>First name</label>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label>Last name</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <button type="submit" style={primaryButton}>Add evaluator</button>
      </form>

      <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden' }}>
        <table>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
            </tr>
          </thead>
          <tbody>
            {evaluators.map((evaluator) => (
              <tr key={evaluator.id}>
                <td style={tdStyle}>{evaluator.firstName} {evaluator.lastName}</td>
                <td style={tdStyle}>{evaluator.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '14px 16px',
  borderBottom: '1px solid #e2e8f0'
};

const tdStyle = {
  padding: '14px 14px',
  borderBottom: '1px solid #e2e8f0'
};

const primaryButton = {
  marginTop: 16,
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: 10,
  padding: '10px 16px',
  cursor: 'pointer'
};

export default EvaluatorsPage;