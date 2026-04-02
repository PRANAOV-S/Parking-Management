import React, { useState, useEffect } from 'react';
import './Approvals.css';

const Approvals = () => {
    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState('Pending'); // Default active filter

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            if (Array.isArray(data)) setBookings(data);
        } catch (err) {
            console.error('Fetch error', err);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/bookings/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                // Optimistic UI update
                setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const filteredBookings = filterStatus === 'All'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    return (
        <div className="approvals-container">
            <div className="approvals-header">
                <h2>Booking Approvals</h2>
                <p>Review and manage all parking slot booking requests.</p>
            </div>

            {/* Filter Pills */}
            <div className="filter-pills">
                {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map(status => (
                    <button
                        key={status}
                        className={`pill-btn ${filterStatus === status ? 'active' : ''} ${status.toLowerCase()}`}
                        onClick={() => setFilterStatus(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Controls Row */}
            <div className="controls-row">
                <div className="dropdowns">
                    <select className="control-select"><option>All Offices</option></select>
                    <select className="control-select"><option>All Categories</option></select>
                    <select className="control-select"><option>All Sessions</option></select>
                </div>
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Search by name, email, or ID" />
                </div>
            </div>

            {/* Table */}
            <div className="table-wrapper glass-panel">
                <div className="table-info">
                    Showing {filteredBookings.length} entries
                </div>
                <table className="approvals-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Slot</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map(item => (
                            <tr key={item.id}>
                                <td className="id-cell">VDHBID-#{item.id}</td>
                                <td>
                                    <div className="user-info">
                                        <span className="user-name">{item.name}</span>
                                        <span className="user-role">{item.userType}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="slot-info">
                                        {item.office}
                                        <small>{item.vehicleType}</small>
                                    </div>
                                </td>
                                <td>
                                    <div className="datetime-info">
                                        <span>{item.date}</span>
                                        <small>{item.inTime} - {item.outTime}</small>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {item.status === 'Pending' && (
                                            <>
                                                <button
                                                    className="action-btn approve"
                                                    title="Approve"
                                                    onClick={() => handleStatusUpdate(item.id, 'Approved')}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    className="action-btn reject"
                                                    title="Reject"
                                                    onClick={() => handleStatusUpdate(item.id, 'Rejected')}
                                                >
                                                    ✕
                                                </button>
                                            </>
                                        )}
                                        <button className="action-btn edit" title="Edit">✎</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && <div className="no-data">No records found.</div>}
            </div>
        </div>
    );
};

export default Approvals;
