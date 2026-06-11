const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup (SQLite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

// Define Booking Model
const Booking = sequelize.define('Booking', {
    office: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userType: {
        type: DataTypes.STRING, // 'employee' or 'visitor'
        allowNull: false
    },
    // Employee Fields
    employeeId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Common Fields
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicleType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicleNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Visitor Fields
    purpose: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Schedule
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    inTime: {
        type: DataTypes.STRING, // Store as JSON string or formatted string e.g. "09:00 AM"
        allowNull: false
    },
    outTime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending', // Pending, Approved, Rejected, Cancelled
        allowNull: false
    }
});

// Define Admin Model
const Admin = sequelize.define('Admin', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adminCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'Admin'
    }
});

// Sync Database & Seed Admin
sequelize.sync()
    .then(async () => {
        console.log('Database & tables created!');
        // Seed default admin if none exists
        const count = await Admin.count();
        if (count === 0) {
            await Admin.create({
                username: 'admin@vdartinc.com',
                password: 'admin',
                email: 'admin@vdartinc.com',
                adminCode: 'MASTER',
                role: 'Super Admin'
            });
            console.log('Default admin seeded.');
        }
    })
    .catch(err => console.error('Error syncing database:', err));

// Routes

// 1. Create a Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const data = req.body;
        const formatTime = (t) => typeof t === 'object' ? `${t.hour}:${t.minute} ${t.period}` : t;
        const bookings = [];

        // Handle Date Range
        if (data.schedule && data.schedule.startDate && data.schedule.endDate) {
            const start = new Date(data.schedule.startDate);
            const end = new Date(data.schedule.endDate);
            const inTimeStr = formatTime(data.schedule.inTime);
            const outTimeStr = formatTime(data.schedule.outTime);

            // Loop through each day
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0]; // Format YYYY-MM-DD local logic (careful with TZs, but good enough for MVP)

                const booking = await Booking.create({
                    ...data,
                    inTime: inTimeStr,
                    outTime: outTimeStr,
                    date: dateStr,
                    office: data.office?.value || data.office
                });
                bookings.push(booking);
            }
        } else {
            // Legacy/Single Date Fallback
            const booking = await Booking.create({
                ...data,
                inTime: formatTime(data.schedule?.inTime || data.inTime),
                outTime: formatTime(data.schedule?.outTime || data.outTime),
                date: data.schedule?.date || data.date,
                office: data.office?.value || data.office
            });
            bookings.push(booking);
        }

        res.status(201).json({ success: true, message: `Confirmed ${bookings.length} booking(s)`, bookings });
    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
    }
});

// 2. Get All/Filtered Bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const { email, mobile } = req.query;
        const whereClause = {};

        if (email) whereClause.email = email;
        if (mobile) whereClause.mobile = mobile;

        const bookings = await Booking.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// 2.5 Update Booking Status
app.put('/api/bookings/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: 'Status updated', booking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. Admin Login (Database backed)
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ where: { username, password } });

        if (admin) {
            res.json({ success: true, token: 'fake-jwt-token-valet-parking', user: admin });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. Admin Management
app.get('/api/admins', async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admins', async (req, res) => {
    try {
        const { adminCode, password, email, role, office, designation, shift, mobile, others } = req.body;
        const newAdmin = await Admin.create({
            adminCode,
            password, // In real app, hash this!
            email,
            username: email, // Use email as username
            role
        });
        res.status(201).json({ success: true, admin: newAdmin });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
