import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BiUser } from 'react-icons/bi';
import { AuthContext } from '../context/AuthContext'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const RegisterPage = () => {
  const { register, error, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',  // Add username because your backend probably expects it
    email: '',
    password: '',
    re_password: '',
  });

  const { first_name, last_name, username, email, password, re_password } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!first_name || !last_name || !username || !email || !password || !re_password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== re_password) {
      toast.error('Passwords do not match');
      return;
    }

    const dataToSend = {
      first_name,
      last_name,
      username,   // include username
      email,
      password,
      re_password,
    };

    try {
      await register(dataToSend);
      toast.success('Registration successful! Activation email sent.');
      navigate('/login');
    } catch (err) {
      toast.error(error || 'Registration failed');
    }
  };

  useEffect(() => {
    if (user) {
      // If user is logged in, redirect or do something else
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="container auth__container">
      <h1 className="main__title animate-fade-slide">
        Register <BiUser />
      </h1>

      {loading && <Spinner />}

      <form className="auth__form animate-fade-slide" onSubmit={handleSubmit}>
        <input
          className="animate-fade-slide"
          style={{ animationDelay: '0.1s' }}
          type="text"
          placeholder="First Name"
          name="first_name"
          onChange={handleChange}
          value={first_name}
          required
        />
        <input
          className="animate-fade-slide"
          style={{ animationDelay: '0.2s' }}
          type="text"
          placeholder="Last Name"
          name="last_name"
          onChange={handleChange}
          value={last_name}
          required
        />
        <input
          className="animate-fade-slide"
          style={{ animationDelay: '0.25s' }}
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleChange}
          value={username}
          required
        />
        <input
          className="animate-fade-slide"
          style={{ animationDelay: '0.3s' }}
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={email}
          required
        />
        <input
          className="animate-fade-slide"
          style={{ animationDelay: '0.4s' }}
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={password}
          required
        />
        <input
          className="animate-fade-slide"
          style={{ animationDelay: '0.5s' }}
          type="password"
          placeholder="Retype Password"
          name="re_password"
          onChange={handleChange}
          value={re_password}
          required
        />

        <button
          className="btn btn-primary animate-fade-slide"
          style={{ animationDelay: '0.6s' }}
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
