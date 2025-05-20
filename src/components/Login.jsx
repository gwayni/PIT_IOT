import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://pit-iot.onrender.com/api/auth/token/login/',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      const token = response.data.auth_token;
      
      // Store token securely
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Full error:', err);
      console.error('Response data:', err.response?.data);
      
      if (err.response) {
        // Handle different error cases
        if (err.response.status === 400) {
          setError('Invalid username or password');
        } else if (err.response.status === 403) {
          setError('Account not active. Please verify your email.');
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
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
            autoComplete="username"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="error-text">
              {error}
              <br />
              <button 
                onClick={() => window.location.reload()} 
                className="retry-button"
              >
                Try Again
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="redirect-text">
          Don't have an account?{' '}
          <button 
            className="link" 
            onClick={() => navigate('/register')}
            disabled={isLoading}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;