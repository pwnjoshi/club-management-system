import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

function Login() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setMessage('Please enter both email and password.');
            return;
        }

        try {
            const response = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('clubUser', JSON.stringify({
                email: response.data.email,
                name: response.data.name,
                role: response.data.role,
            }));
            navigate('/dashboard');
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="page shell-bg auth-wrap">
            <div className="glass auth-card rise-up delay-1">
                <p className="badge">College Club Management</p>
                <h1 className="title">Sign In</h1>
                <p className="muted">Use your account to continue to the event portal.</p>

                <form onSubmit={handleSubmit} className="stack">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="name@college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {message && <p className="status-banner">{message}</p>}

                    <button type="submit" className="btn primary">Login</button>
                    <p className="muted">New here? <Link to="/register">Create an account</Link></p>
                </form>

                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--line)', paddingTop: '1.2rem' }}>
                    <p className="muted" style={{ marginBottom: '0.6rem', fontSize: '0.85rem', textAlign: 'center' }}>Quick demo access</p>
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                            className="btn ghost"
                            style={{ flex: 1 }}
                            onClick={() => { setEmail('1@1.com'); setPassword('11111'); }}
                        >
                            👤 Student Demo
                        </button>
                        <button
                            className="btn ghost"
                            style={{ flex: 1 }}
                            onClick={() => { setEmail('admin@college.com'); setPassword('admin123'); }}
                        >
                            🛡️ Admin Demo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
