import React, { useState } from 'react';
import './ParkingSlots.css';

const ParkingSlots = () => {
    // Mock Data for Slots - In a real app, this would come from an API
    const initialSlots = Array.from({ length: 20 }, (_, i) => ({
        id: `A-${i + 1}`,
        type: i < 10 ? '4-wheeler' : '2-wheeler',
        floor: 'Level 1',
        status: i === 2 || i === 5 ? 'Occupied' : (i === 8 ? 'Maintenance' : 'Available'),
    }));

    const [slots, setSlots] = useState(initialSlots);
    const [filterType, setFilterType] = useState('All');

    const filteredSlots = filterType === 'All'
        ? slots
        : slots.filter(s => s.type === filterType);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'success';
            case 'Occupied': return 'danger';
            case 'Maintenance': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <div className="slots-container">
            <div className="slots-header">
                <h2>Parking Slots Management</h2>
                <button className="btn-add-slot">+ Add New Slot</button>
            </div>

            {/* Filters */}
            <div className="slots-filters">
                <button
                    className={`filter-btn ${filterType === 'All' ? 'active' : ''}`}
                    onClick={() => setFilterType('All')}
                >
                    All Slots
                </button>
                <button
                    className={`filter-btn ${filterType === '4-wheeler' ? 'active' : ''}`}
                    onClick={() => setFilterType('4-wheeler')}
                >
                    4-Wheelers
                </button>
                <button
                    className={`filter-btn ${filterType === '2-wheeler' ? 'active' : ''}`}
                    onClick={() => setFilterType('2-wheeler')}
                >
                    2-Wheelers
                </button>
            </div>

            {/* Slots Grid */}
            <div className="slots-grid-view">
                {filteredSlots.map(slot => (
                    <div key={slot.id} className={`slot-card ${slot.status.toLowerCase()}`}>
                        <div className="slot-header">
                            <span className="slot-id">{slot.id}</span>
                            <span className={`status-dot ${getStatusColor(slot.status)}`}></span>
                        </div>
                        <div className="slot-body">
                            <p className="slot-type">{slot.type === '4-wheeler' ? '🚗 Car' : '🏍️ Bike'}</p>
                            <p className="slot-floor">{slot.floor}</p>
                        </div>
                        <div className="slot-footer">
                            <span className="current-status">{slot.status}</span>
                            <button className="btn-icon">⋮</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParkingSlots;
