import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

function Register() {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!register.name || !register.email || !register.password) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await api.post('/api/auth/register', register);
      setMessage(response.data.message || 'Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 800);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Registration failed. Try a different email.');
    }
  };

  return (
    <div className="page shell-bg auth-wrap">
      <div className="glass auth-card rise-up delay-2">
        <p className="badge">Get Started</p>
        <h1 className="title">Create Account</h1>

        <form onSubmit={handleSubmit} className="stack">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={register.name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@college.edu"
            value={register.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Minimum 5 characters"
            value={register.password}
            onChange={handleChange}
          />

          {message && <p className="status-banner">{message}</p>}

          <button type="submit" className="btn primary">Register</button>
          <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Register;
