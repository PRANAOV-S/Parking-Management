import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import logo from '../assets/logo.png';
import Approvals from './Approvals';
import ParkingSlots from './ParkingSlots';
import OfficeMaster from './OfficeMaster';
import CreateAdmin from './CreateAdmin';

const AdminDashboard = ({ onLogout }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('current'); // current, upcoming, pending
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'approvals', 'slots', 'office', 'create-admin'

    useEffect(() => {
        if (activeView === 'dashboard') {
            fetchBookings();
        }
    }, [activeView]);

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings');
            const data = await response.json();
            if (Array.isArray(data)) setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Real Stats
    const today = new Date().toISOString().split('T')[0];

    // Helper to compare dates (simple string comparison works for YYYY-MM-DD)
    const isFuture = (dateStr) => {
        return dateStr > today;
    };

    const isToday = (dateStr) => (dateStr === today);

    const metrics = {
        total: bookings.length,
        available: 100 - bookings.filter(b => isToday(b.date)).length, // Assuming 100 spots capacity
        maintenance: 0,
        upcoming: bookings.filter(b => isFuture(b.date)).length,
        approved: bookings.filter(b => b.status === 'Approved').length, // Filter by status now
        pending: bookings.filter(b => b.status === 'Pending').length,
        rejected: bookings.filter(b => b.status === 'Rejected').length,
        cancelled: bookings.filter(b => b.status === 'Cancelled').length
    };

    const renderMetricCard = (label, value, iconEmoji, colorClass) => (
        <div className="metric-card">
            <div className={`metric-icon ${colorClass}`}>
                {iconEmoji}
            </div>
            <div className="metric-info">
                <span className="metric-label">{label}</span>
                <span className="metric-value">{value}</span>
            </div>
        </div>
    );

    const renderDashboardContent = () => (
        <main className="main-content">
            {/* Header / Filters */}
            <header className="dashboard-topbar">
                <div className="filters-row">
                    <select className="filter-select"><option>All Offices</option></select>
                    <select className="filter-select"><option>All Categories</option></select>
                    <select className="filter-select"><option>All Sessions</option></select>
                    <div className="date-range-filter">
                        <input type="date" className="date-input" placeholder="From" />
                        <input type="date" className="date-input" placeholder="To" />
                    </div>
                </div>
                <button className="export-btn">Export</button>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                {renderMetricCard("Total Slots", metrics.total, "🏢", "blue")}
                {renderMetricCard("Available Slots", metrics.available, "✅", "purple")}
                {renderMetricCard("Maintenance", metrics.maintenance, "⚙️", "orange")}
                {renderMetricCard("Upcoming Booked", metrics.upcoming, "📅", "indigo")}

                {renderMetricCard("Approved Bookings", metrics.approved, "👍", "green")}
                {renderMetricCard("Pending Bookings", metrics.pending, "🕒", "yellow")}
                {renderMetricCard("Rejected Bookings", metrics.rejected, "❌", "red")}
                {renderMetricCard("Cancelled Bookings", metrics.cancelled, "🚫", "gray")}
            </div>

            {/* Content Tabs */}
            <div className="content-tabs">
                <div className="tabs-header">
                    <button
                        className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
                        onClick={() => setActiveTab('current')}
                    >
                        Currently Occupied Slots
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Approved Bookings
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Approvals
                    </button>
                </div>

                <div className="tab-content glass-panel">
                    {loading ? <div className="loading">Loading...</div> : (
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Details</th>
                                    <th>Type</th>
                                    <th>Schedule</th>
                                    <th>Vehicle</th>
                                    <th>Office</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.slice(0, 10).map(row => (
                                    <tr key={row.id}>
                                        <td>{row.date}</td>
                                        <td>
                                            <div className="user-cell">
                                                <strong>{row.name}</strong>
                                                <small>{row.mobile}</small>
                                            </div>
                                        </td>
                                        <td><span className={`type-tag ${row.userType}`}>{row.userType}</span></td>
                                        <td>{row.inTime} - {row.outTime}</td>
                                        <td>{row.vehicleNumber}</td>
                                        <td>{row.office}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && bookings.length === 0 && <div className="empty-state">No records found.</div>}
                </div>
            </div>
        </main>
    );

    const renderMainContent = () => {
        switch (activeView) {
            case 'dashboard': return renderDashboardContent();
            case 'approvals': return <main className="main-content"><Approvals /></main>;
            case 'slots': return <main className="main-content"><ParkingSlots /></main>;
            case 'office': return <main className="main-content"><OfficeMaster /></main>;
            case 'create-admin': return <main className="main-content"><CreateAdmin /></main>;
            default: return renderDashboardContent();
        }
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <img src={logo} alt="VDart" />
                </div>
                <nav className="sidebar-menu">
                    <a
                        href="#"
                        className={`menu-item ${activeView === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveView('dashboard')}
                    >
                        Dashboard
                    </a>
                    <a
                        href="#"
                        className={`menu-item ${activeView === 'approvals' ? 'active' : ''}`}
                        onClick={() => setActiveView('approvals')}
                    >
                        Approvals
                    </a>
                    <a
                        href="#"
                        className={`menu-item ${activeView === 'slots' ? 'active' : ''}`}
                        onClick={() => setActiveView('slots')}
                    >
                        Parking Slots
                    </a>
                    <a
                        href="#"
                        className={`menu-item ${activeView === 'office' ? 'active' : ''}`}
                        onClick={() => setActiveView('office')}
                    >
                        Office Master
                    </a>
                    <a
                        href="#"
                        className={`menu-item ${activeView === 'create-admin' ? 'active' : ''}`}
                        onClick={() => setActiveView('create-admin')}
                    >
                        Create Admin
                    </a>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={onLogout} className="logout-link">Logout</button>
                </div>
            </aside>

            {renderMainContent()}
        </div>
    );
};

export default AdminDashboard;
