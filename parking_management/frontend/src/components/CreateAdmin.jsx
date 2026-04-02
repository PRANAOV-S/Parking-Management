import React, { useState, useEffect } from 'react';
import './CreateAdmin.css';

const CreateAdmin = () => {
    const [formData, setFormData] = useState({
        adminCode: 'ADM002',
        password: '',
        email: '',
        role: 'Admin',
        office: '',
        designation: '',
        shift: '',
        mobile: '',
        others: ''
    });

    const [existingAdmins, setExistingAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/admins');
            const data = await res.json();
            if (Array.isArray(data)) setExistingAdmins(data);
        } catch (err) {
            console.error('Fetch error', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            alert('Email and Password are required');
            return;
        }

        try {
            const res = await fetch('/api/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                alert('Admin user created successfully!');
                fetchAdmins(); // Refresh list
                setFormData({
                    adminCode: `ADM00${existingAdmins.length + 2}`,
                    password: '',
                    email: '',
                    role: 'Admin',
                    office: '',
                    designation: '',
                    shift: '',
                    mobile: '',
                    others: ''
                });
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            alert('Failed to connect to server');
        }
    };

    return (
        <div className="create-admin-container">
            <div className="ca-header">
                <h2>Create Admin User</h2>
                <p>Add a new administrator to the system.</p>
            </div>

            <div className="ca-layout">
                {/* Left Column: Form */}
                <div className="ca-form-card glass-panel">
                    <form onSubmit={handleSubmit} className="ca-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Admin Code</label>
                                <input
                                    type="text"
                                    name="adminCode"
                                    value={formData.adminCode}
                                    onChange={handleChange}
                                    placeholder="Enter Admin Code"
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select name="role" value={formData.role} onChange={handleChange}>
                                    <option value="Admin">Admin</option>
                                    <option value="Super Admin">Super Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Select Office</label>
                                <select name="office" value={formData.office} onChange={handleChange}>
                                    <option value="">Select Office</option>
                                    <option value="Trichy">Trichy</option>
                                    <option value="Bangalore">Bangalore</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    placeholder="Designation"
                                />
                            </div>
                            <div className="form-group">
                                <label>Shift</label>
                                <input
                                    type="text"
                                    name="shift"
                                    value={formData.shift}
                                    onChange={handleChange}
                                    placeholder="Shift"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="Mobile Number"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Others</label>
                            <textarea
                                name="others"
                                value={formData.others}
                                onChange={handleChange}
                                placeholder="Others"
                                rows="3"
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-create-admin">Create Admin</button>
                    </form>
                </div>

                {/* Right Column: Existing Admins */}
                <div className="ca-list-card glass-panel">
                    <h3>Existing Admin Users</h3>
                    <div className="admin-list">
                        {existingAdmins.map(admin => (
                            <div key={admin.id} className="admin-item">
                                <div className="admin-details">
                                    <span className="admin-name">{admin.adminCode}</span>
                                    <span className="admin-email">{admin.email}</span>
                                </div>
                                <div className="admin-meta">
                                    <span className="role-badge">{admin.role}</span>
                                    <button className="edit-link">Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAdmin;
