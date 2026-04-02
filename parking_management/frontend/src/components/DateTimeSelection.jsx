import React, { useState, useEffect } from 'react';
import './DateTimeSelection.css';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const ScrollWheel = ({ items, value, onChange }) => {
    const containerRef = React.useRef(null);
    const ITEM_HEIGHT = 40;

    // Scroll to selected value on mount / change
    useEffect(() => {
        if (containerRef.current) {
            const index = items.indexOf(value);
            if (index !== -1) {
                containerRef.current.scrollTop = index * ITEM_HEIGHT;
            }
        }
    }, [value, items]); // Note: In a real app, might want to avoid loop if onScroll updates back

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);
        const validIndex = Math.max(0, Math.min(index, items.length - 1));
        const newValue = items[validIndex];

        // Only trigger change if different (and debounce could be added here)
        if (newValue !== value) {
            onChange(newValue);
        }
    };

    return (
        <div
            className="wheel-container"
            ref={containerRef}
            onScroll={handleScroll}
        >
            <div style={{ height: ITEM_HEIGHT }}></div> {/* Top Spacer */}
            {items.map((item) => (
                <div
                    key={item}
                    className={`wheel-item ${item === value ? 'active' : ''}`}
                    onClick={() => onChange(item)} // Allow clicking
                >
                    {item}
                </div>
            ))}
            <div style={{ height: ITEM_HEIGHT }}></div> {/* Bottom Spacer */}
        </div>
    );
};

const TimePicker = ({ label, value, onChange }) => {
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const periods = ['AM', 'PM'];

    return (
        <div className="picker-group">
            <div className="picker-label">{label}</div>
            <div className="wheels-wrapper glass-panel">
                <ScrollWheel
                    items={hours}
                    value={value.hour}
                    onChange={(v) => onChange({ ...value, hour: v })}
                />
                <div className="wheel-separator">:</div>
                <ScrollWheel
                    items={minutes}
                    value={value.minute}
                    onChange={(v) => onChange({ ...value, minute: v })}
                />
                <ScrollWheel
                    items={periods}
                    value={value.period}
                    onChange={(v) => onChange({ ...value, period: v })}
                />
            </div>
        </div>
    );
};

const DateTimeSelection = ({ onDateTimeChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    const [inTime, setInTime] = useState({ hour: '09', minute: '00', period: 'AM' });
    const [outTime, setOutTime] = useState({ hour: '06', minute: '00', period: 'PM' });

    // Update parent whenever selection changes
    useEffect(() => {
        onDateTimeChange({ startDate, endDate, inTime, outTime });
    }, [startDate, endDate, inTime, outTime]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isSameDay = (d1, d2) => {
        return d1 && d2 && d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const normalizeDate = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

        if (!startDate || (startDate && endDate)) {
            // Start fresh selection
            setStartDate(clickedDate);
            setEndDate(null);
        } else if (startDate && !endDate) {
            // Selecting end date
            if (clickedDate < startDate) {
                // User clicked a date before start, swap them
                setEndDate(startDate);
                setStartDate(clickedDate);
            } else {
                setEndDate(clickedDate);
            }
        }
    };

    const renderCalendarDays = () => {
        const totalDays = getDaysInMonth(currentDate);
        const startDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        const normalizedStart = startDate ? normalizeDate(startDate) : null;
        const normalizedEnd = endDate ? normalizeDate(endDate) : null;

        // Days of current month
        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const normalizedCurrent = normalizeDate(date);

            let className = 'calendar-day';

            if (isSameDay(date, startDate)) className += ' selected start';
            else if (isSameDay(date, endDate)) className += ' selected end';
            else if (startDate && endDate && normalizedCurrent > normalizedStart && normalizedCurrent < normalizedEnd) {
                className += ' in-range';
            }

            days.push(
                <div
                    key={i}
                    className={className}
                    onClick={() => handleDateClick(i)}
                >
                    {i}
                </div>
            );
        }
        return days;
    };

    const formatTimeObj = (t) => `${t.hour}:${t.minute} ${t.period}`;

    return (
        <div className="date-time-container">
            <h3 className="section-title">Select Date Range & Time</h3>

            <div className="dt-layout">
                {/* Left: Calendar */}
                <div className="calendar-card glass-panel">
                    <div className="calendar-header">
                        <h4>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
                        <div className="calendar-nav">
                            <button onClick={handlePrevMonth}>&lt;</button>
                            <button onClick={handleNextMonth}>&gt;</button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        {daysOfWeek.map(d => <div key={d} className="calendar-header-day">{d}</div>)}
                        {renderCalendarDays()}
                    </div>
                </div>

                {/* Right: Time Selection */}
                <div className="time-selection-card">
                    <h4 className="time-heading">Select Timing</h4>
                    <div className="time-inputs-row">
                        <TimePicker label="In Time" value={inTime} onChange={setInTime} />
                        <div className="time-arrow">➜</div>
                        <TimePicker label="Out Time" value={outTime} onChange={setOutTime} />
                    </div>

                    <div className="summary-section">
                        <h5>Booking Summary</h5>
                        <p>
                            <strong>Daily</strong> from {formatTimeObj(inTime)} to {formatTimeObj(outTime)}<br />
                            <strong>Period:</strong> {startDate ? startDate.toLocaleDateString() : 'Select Date'} - {endDate ? endDate.toLocaleDateString() : (startDate ? startDate.toLocaleDateString() : 'Select Date')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateTimeSelection;
