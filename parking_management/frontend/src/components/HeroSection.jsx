import React from 'react';
import './HeroSection.css';

const HeroSection = ({ onOfficeSelect }) => {
    const handleSelect = (e) => {
        const value = e.target.value;
        const label = e.target.options[e.target.selectedIndex].text;
        if (value) {
            onOfficeSelect({ value, label });
        }
    };

    return (
        <section className="hero-container">
            <div className="hero-content">
                <h1 className="hero-title">Parking Management</h1>
                <p className="hero-subtitle">
                    Find, book, and manage your parking spots with ease.
                    Our intuitive system streamlines the entire process.
                </p>

                <div className="hero-search-box glass-panel">
                    <label htmlFor="location-select" className="search-label">Select an office...</label>
                    <div className="select-wrapper">
                        <select
                            id="location-select"
                            className="location-select"
                            defaultValue=""
                            onChange={handleSelect}
                        >
                            <option value="" disabled selected>Choose location</option>
                            <option value="trichy">VDart GCC, Trichy</option>
                            <option value="bangalore">VDart Digital, Bangalore</option>
                            <option value="chennai">VDart Digital, Chennai</option>
                            <option value="atlanta">VDart, US Atlanta</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="hero-shape shape-1"></div>
            <div className="hero-shape shape-2"></div>
        </section>
    );
};

export default HeroSection;
