import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const result = await response.json();

            if (result.success) {
                onLoginSuccess(result.token);
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error occurring during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container glass-panel">
            <h2 className="admin-title">Admin Access</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <div className="error-msg">{error}</div>}

                <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                    {loading ? 'Verifying...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
