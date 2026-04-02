import React, { useState } from 'react';
import './BookingForm.css';
import DateTimeSelection from './DateTimeSelection';

const BookingForm = ({ selectedOffice, onBack }) => {
    const [step, setStep] = useState(1); // 1: Details, 2: Date & Time
    const [userType, setUserType] = useState('employee');
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        mobile: '',
        email: '',
        vehicleType: '2-wheeler',
        vehicleNumber: '',
        purpose: ''
    });
    const [dateTimeData, setDateTimeData] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const validateStep1 = () => {
        const newErrors = {};

        // Name Validation
        if (!formData.name.trim()) newErrors.name = "Name is required";

        // Mobile Validation (10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!formData.mobile.match(mobileRegex)) {
            newErrors.mobile = "Mobile must be a valid 10-digit number";
        }

        // Email Validation (VDart domains)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(vdartinc\.com|vdartacademy\.com)$/;
        if (!formData.email.match(emailRegex)) {
            newErrors.email = "Email must be @vdartinc.com or @vdartacademy.com";
        }

        // Vehicle Number
        if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = "Vehicle number is required";

        // Employee ID (if employee)
        if (userType === 'employee' && !formData.employeeId.trim()) {
            newErrors.employeeId = "Employee ID is required";
        }

        // Purpose (if visitor)
        if (userType === 'visitor' && !formData.purpose.trim()) {
            newErrors.purpose = "Purpose of visit is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async (e) => {
        e.preventDefault();

        if (step === 1) {
            if (validateStep1()) {
                setErrors({}); // Clear errors
                setStep(2);
            }
        } else {
            // Final Submit
            setIsSubmitting(true);
            const payload = {
                office: selectedOffice,
                userType,
                ...formData,
                schedule: dateTimeData // Adjusted key to match backend 'data.schedule' check
            };

            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.success) {
                    alert('Booking Confirmed Successfully!');
                    onBack();
                } else {
                    alert('Booking Failed: ' + (result.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Submission Error:', error);
                alert('Network Error: Failed to connect to server.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
        else onBack();
    };

    return (
        <div className="booking-page-container">
            {/* Header / Breadcrumb */}
            <div className="booking-header">
                <h2 className="office-title">{selectedOffice.label}</h2>
                <button className="btn-ghost home-btn" onClick={handleBack} disabled={isSubmitting}>
                    <span className="icon">←</span> {step === 1 ? 'Home' : 'Back'}
                </button>
            </div>

            <div className="booking-content-wrapper">
                {/* Left Side - Visual */}
                <div className="booking-visual glass-panel">
                    <div className="visual-text">
                        <h3>Visual Guide</h3>
                        <p>{step === 1 ? 'Enter Details' : 'Select Schedule'}</p>
                    </div>
                    <div className="visual-placeholder"></div>
                </div>

                {/* Right Side - Form */}
                <div className="booking-form-card">
                    <h3 className="form-heading">
                        {step === 1 ? 'Booking Information' : 'Schedule'}
                    </h3>
                    {step === 1 && <p className="form-instruction">Please enter your details below to proceed with the booking.</p>}

                    <form onSubmit={handleNext} className="booking-form">

                        {/* STEP 1: Personal Details */}
                        {step === 1 && (
                            <>
                                <div className="user-type-toggle">
                                    <button
                                        type="button"
                                        className={`toggle-btn ${userType === 'employee' ? 'active' : ''}`}
                                        onClick={() => setUserType('employee')}
                                    >
                                        Employee
                                    </button>
                                    <button
                                        type="button"
                                        className={`toggle-btn ${userType === 'visitor' ? 'active' : ''}`}
                                        onClick={() => setUserType('visitor')}
                                    >
                                        Visitor
                                    </button>
                                </div>

                                <h4 className="form-section-heading">Personal Details</h4>

                                {userType === 'employee' && (
                                    <div className="form-group">
                                        <label>Employee ID <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={formData.employeeId}
                                            onChange={handleInputChange}
                                            className={errors.employeeId ? 'error-input' : ''}
                                            placeholder="e.g. EMP001"
                                            required
                                        />
                                        {errors.employeeId && <span className="error-text">{errors.employeeId}</span>}
                                    </div>
                                )}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Name <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={errors.name ? 'error-input' : ''}
                                            placeholder="e.g. John Doe"
                                            required
                                        />
                                        {errors.name && <span className="error-text">{errors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Mobile <span className="required">*</span></label>
                                        <div className="input-with-prefix">
                                            <span className="prefix">+91</span>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                className={errors.mobile ? 'error-input' : ''}
                                                placeholder="9876543210"
                                                required
                                            />
                                        </div>
                                        {errors.mobile && <span className="error-text">{errors.mobile}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={errors.email ? 'error-input' : ''}
                                        placeholder="john@vdartinc.com"
                                        required
                                    />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                    <span className="helper-text">Allowed: vdartacademy.com, vdartinc.com</span>
                                </div>

                                <h4 className="form-section-heading">Vehicle Details</h4>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Vehicle Type <span className="required">*</span></label>
                                        <select
                                            name="vehicleType"
                                            value={formData.vehicleType}
                                            onChange={handleInputChange}
                                        >
                                            <option value="2-wheeler">2-Wheeler</option>
                                            <option value="4-wheeler">4-Wheeler</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Vehicle Number <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            name="vehicleNumber"
                                            value={formData.vehicleNumber}
                                            onChange={handleInputChange}
                                            className={errors.vehicleNumber ? 'error-input' : ''}
                                            placeholder="TN-01-AB-1234"
                                            required
                                        />
                                        {errors.vehicleNumber && <span className="error-text">{errors.vehicleNumber}</span>}
                                    </div>
                                </div>

                                {userType === 'visitor' && (
                                    <>
                                        <h4 className="form-section-heading">Visit Details</h4>
                                        <div className="form-group">
                                            <label>Purpose <span className="required">*</span></label>
                                            <textarea
                                                name="purpose"
                                                value={formData.purpose}
                                                onChange={handleInputChange}
                                                className={errors.purpose ? 'error-input' : ''}
                                                rows="3"
                                                placeholder="Reason for visit..."
                                                required
                                            ></textarea>
                                            {errors.purpose && <span className="error-text">{errors.purpose}</span>}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* STEP 2: Date & Time */}
                        {step === 2 && (
                            <DateTimeSelection onDateTimeChange={setDateTimeData} />
                        )}

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary submit-btn"
                                disabled={isSubmitting}
                            >
                                {step === 1 ? 'Next Step ➜' : (isSubmitting ? 'Confirming...' : 'Confirm Booking')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
