import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const response = await axios.post(
      'https://pit-iot.onrender.com/api/auth/token/login/',
    { username, password },
    { withCredentials: true }
  );
    const token = response.data.auth_token;
    localStorage.setItem('token', token);
    navigate('/dashboard');
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    setError('Invalid username or password');
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">🔒</div>
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Sign In</button>
        </form>

        <p className="redirect-text">
          Don’t have an account?{' '}
          <button className="link" onClick={() => navigate('/register')}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
