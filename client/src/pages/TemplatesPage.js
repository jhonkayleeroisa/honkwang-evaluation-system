import React, { useEffect, useState } from 'react';
import api from '../services/api';

function TemplatesPage() {
  const [employees, setEmployees] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [cycleForm, setCycleForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [assignmentForm, setAssignmentForm] = useState({
    evaluationCycleId: '',
    evaluatorId: '',
    employeeId: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeeRes, evaluatorRes, cycleRes] = await Promise.all([
          api.get('/employees'),
          api.get('/evaluators'),
          api.get('/evaluations/cycles')
        ]);

        setEmployees(employeeRes.data);
        setEvaluators(evaluatorRes.data);
        setCycles(cycleRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const handleCreateCycle = async (e) => {
    e.preventDefault();
    const res = await api.post('/evaluations/cycles', cycleForm);
    setCycles((prev) => [res.data, ...prev]);
    setCycleForm({ name: '', description: '', startDate: '', endDate: '' });
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await api.post('/evaluations/assign', assignmentForm);
      alert('Evaluation assigned and email sent to evaluator.');
      setAssignmentForm({ evaluationCycleId: '', evaluatorId: '', employeeId: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Assignment failed');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Evaluation cycles</h2>

      <form onSubmit={handleCreateCycle} style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div>
            <label>Cycle name</label>
            <input value={cycleForm.name} onChange={(e) => setCycleForm({ ...cycleForm, name: e.target.value })} />
          </div>
          <div>
            <label>Start date</label>
            <input type="date" value={cycleForm.startDate} onChange={(e) => setCycleForm({ ...cycleForm, startDate: e.target.value })} />
          </div>
          <div>
            <label>End date</label>
            <input type="date" value={cycleForm.endDate} onChange={(e) => setCycleForm({ ...cycleForm, endDate: e.target.value })} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Description</label>
          <textarea
            rows="4"
            value={cycleForm.description}
            onChange={(e) => setCycleForm({ ...cycleForm, description: e.target.value })}
          />
        </div>

        <button type="submit" style={primaryButton}>Create cycle</button>
      </form>

      <h3>Assign evaluator to employee</h3>
      <form onSubmit={handleAssign} style={{ background: 'white', borderRadius: 16, padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div>
            <label>Cycle</label>
            <select value={assignmentForm.evaluationCycleId} onChange={(e) => setAssignmentForm({ ...assignmentForm, evaluationCycleId: e.target.value })}>
              <option value="">Select cycle</option>
              {cycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>{cycle.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Evaluator</label>
            <select value={assignmentForm.evaluatorId} onChange={(e) => setAssignmentForm({ ...assignmentForm, evaluatorId: e.target.value })}>
              <option value="">Select evaluator</option>
              {evaluators.map((evaluator) => (
                <option key={evaluator.id} value={evaluator.id}>
                  {evaluator.firstName} {evaluator.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Employee</label>
            <select value={assignmentForm.employeeId} onChange={(e) => setAssignmentForm({ ...assignmentForm, employeeId: e.target.value })}>
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" style={primaryButton}>Assign & send email</button>
      </form>
    </div>
  );
}

const primaryButton = {
  marginTop: 16,
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: 10,
  padding: '10px 16px',
  cursor: 'pointer'
};

export default TemplatesPage;