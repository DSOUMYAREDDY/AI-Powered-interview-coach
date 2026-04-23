import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app we'd validate and authenticate here
    navigate('/interview');
  };

  return (
    <div className="login-page">
      <div className="login-green-box">
        <div className="login-card">
          <h2 className="text-center mb-1">AI-Powered Interview Coach</h2>
          <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
            Login to practice and improve your interview skills
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#2f3b36', border: 'none' }}>
              Login
            </button>
          </form>

          <p className="text-center mt-4" style={{ fontSize: '0.85rem' }}>
            <span className="text-muted">New user? </span>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'underline' }}>Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
