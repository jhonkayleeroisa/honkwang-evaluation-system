import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('admin@evaluation-system.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#e2e8f0' }}>
      <div style={{ width: '420px', background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 20px 40px rgba(15,23,42,0.08)' }}>
        <h2 style={{ marginTop: 0 }}>Employee Evaluation System</h2>
        <p style={{ color: '#64748b', marginTop: 0 }}>Administrator login</p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              border: 'none',
              background: '#2563eb',
              color: 'white',
              padding: '12px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: 18, color: '#64748b', fontSize: 14 }}>
          Demo admin:
          <div><strong>admin@evaluation-system.com</strong></div>
          <div><strong>admin123</strong></div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;