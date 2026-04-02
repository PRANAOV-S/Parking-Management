import React, { useState } from 'react';
import './OfficeMaster.css';

const OfficeMaster = () => {
    // Mock Data
    const [offices, setOffices] = useState([
        { id: 1, name: 'VDart GCC, Trichy', location: 'Tiruchy' },
        { id: 2, name: 'VDart Digital, Bangalore', location: 'Bangalore' },
        { id: 3, name: 'VDart Digital, Chennai', location: 'Chennai' },
        { id: 4, name: 'VDart, US Atlanta', location: 'Alpharetta' },
    ]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this office?')) {
            setOffices(offices.filter(office => office.id !== id));
        }
    };

    return (
        <div className="office-master-container">
            <div className="om-header">
                <h2>Office Master</h2>
                <p>Manage your office locations.</p>
            </div>

            <div className="om-content glass-panel">
                <div className="om-actions-bar">
                    <button className="btn-add-office">+ Add Office</button>
                </div>

                <table className="om-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>NAME</th>
                            <th style={{ width: '40%' }}>LOCATION</th>
                            <th style={{ width: '20%' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offices.map(office => (
                            <tr key={office.id}>
                                <td className="office-name">{office.name}</td>
                                <td className="office-location">{office.location}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-btn edit" title="Edit">✎</button>
                                        <button
                                            className="icon-btn delete"
                                            title="Delete"
                                            onClick={() => handleDelete(office.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {offices.length === 0 && (
                            <tr>
                                <td colSpan="3" className="no-data">No offices found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OfficeMaster;
