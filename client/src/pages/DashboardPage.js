import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [cycles, setCycles] = useState([]);

  useEffect(() => {
    const load = async () => {
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

    load();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <Header />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginTop: 24 }}>
        <StatCard title="Employees" value={employees.length} to="/employees" />
        <StatCard title="Evaluators" value={evaluators.length} to="/evaluators" />
        <StatCard title="Cycles" value={cycles.length} to="/templates" />
      </div>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <h1 style={{ margin: 0 }}>Dashboard</h1>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/" style={navLink}>Overview</Link>
        <Link to="/employees" style={navLink}>Employees</Link>
        <Link to="/evaluators" style={navLink}>Evaluators</Link>
        <Link to="/templates" style={navLink}>Templates</Link>
        <button onClick={logout} style={logoutButton}>Logout</button>
      </div>
    </div>
  );
}

function StatCard({ title, value, to }) {
  return (
    <Link to={to} style={cardStyle}>
      <div style={{ color: '#64748b', fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 36, fontWeight: 700, marginTop: 10 }}>{value}</div>
    </Link>
  );
}

const cardStyle = {
  display: 'block',
  background: 'white',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
  color: '#0f172a'
};

const navLink = {
  color: '#1e293b',
  fontWeight: 600,
  padding: '8px 10px',
  borderRadius: 8
};

const logoutButton = {
  border: 'none',
  background: '#ef4444',
  color: 'white',
  borderRadius: 8,
  padding: '10px 14px',
  cursor: 'pointer'
};

export default DashboardPage;