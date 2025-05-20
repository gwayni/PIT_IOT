import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiLogInCircle } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = formData;

  const { login, user, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
    } catch (err) {
      // Error is already set in context, but you can notify here too
      toast.error("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (user) {
      navigate("/dashboard");
    }
  }, [error, user, navigate]);

  return (
    <div className="container auth__container">
      <h1 className="main__title animate-fade-slide">
        Login <BiLogInCircle />
      </h1>

      {loading && <Spinner />}

      <form className="auth__form animate-fade-slide" onSubmit={handleSubmit}>
        <input
          className="animate-fade-slide"
          style={{ animationDelay: "0.1s" }}
          type="text"
          placeholder="Username"
          name="username"
          value={username}
          onChange={handleChange}
          required
        />
        <input
          className="animate-fade-slide"
          style={{ animationDelay: "0.2s" }}
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={handleChange}
          required
        />
        <Link
          className="animate-fade-slide"
          to="/reset-password"
          style={{ animationDelay: "0.3s" }}
        >
          Forget Password?
        </Link>

        <button
          className="btn btn-primary animate-fade-slide"
          type="submit"
          style={{ animationDelay: "0.4s" }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
