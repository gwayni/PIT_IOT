import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'https://pit-iot.onrender.com/api/auth/users/',
        form
      );

      console.log('✅ Registration successful:', response.data);
      navigate('/login');
    } catch (err) {
      console.error('❌ Registration error:', err.response?.data || err.message);

      if (err.response?.data) {
        const errors = err.response.data;
        const message = Object.entries(errors)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('\n');
        setError(message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      {error && <p style={{ color: 'red', whiteSpace: 'pre-line' }}>{error}</p>}

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
