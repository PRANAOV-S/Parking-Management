import React, { useState } from 'react';
import './HistoryTracking.css';

const HistoryTracking = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [bookings, setBookings] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);
        setBookings([]);

        try {
            // Determine parameter type (simple check)
            const param = searchQuery.includes('@') ? `email=${searchQuery}` : `mobile=${searchQuery}`;

            const response = await fetch(`/api/bookings?${param}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                setBookings(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="history-container glass-panel">
            <h2 className="history-title">Track Your Bookings</h2>
            <p className="history-subtitle">Enter your registered Email or Mobile Number</p>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="e.g. john@vdartinc.com or 9876543210"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-btn btn btn-primary">
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <div className="results-area">
                {searched && !loading && bookings.length === 0 && (
                    <div className="no-results">No bookings found for these details.</div>
                )}

                {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                        <div className="card-header">
                            <span className="office-tag">{booking.office}</span>
                            <span className="date-tag">{booking.date}</span>
                        </div>
                        <div className="card-body">
                            <div className="time-row">
                                <span>IN: <strong>{booking.inTime}</strong></span>
                                <span className="arrow">→</span>
                                <span>OUT: <strong>{booking.outTime}</strong></span>
                            </div>
                            <div className="detail-row">
                                <span>Vehicle: {booking.vehicleNumber}</span>
                                <span>{booking.vehicleType}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryTracking;
