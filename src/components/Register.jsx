import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await register(form);
    navigate('/login');
  } catch (error) {
    // Try to parse JSON error messages if possible
    let message = error.message;
    try {
      const data = JSON.parse(error.message);
      // Format the error messages nicely
      message = Object.entries(data)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('\n');
    } catch {
      // Keep the original error.message if JSON parse fails
    }
    alert('Registration failed:\n' + message);
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        name="email"
        type="email"
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="username"
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
