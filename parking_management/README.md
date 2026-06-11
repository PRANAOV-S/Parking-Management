# VDart Parking Management System

A modern, full-stack parking management solution designed to streamline parking space reservation, approval workflow, and occupancy tracking for employees and visitors across multiple corporate offices.

---

## 🏢 Project Overview

The **VDart Parking Management System** provides an intuitive, high-performance interface for managing corporate parking assets. It consists of a user-facing booking portal and an administrative control panel. The system is designed to handle multiple office branches, validate user details, support flexible date ranges, and allow administrators to monitor, approve, or reject booking requests in real-time.

### Target Office Branches
*   **VDart GCC, Trichy** (Tiruchy)
*   **VDart Digital, Bangalore** (Bangalore)
*   **VDart Digital, Chennai** (Chennai)
*   **VDart, US Atlanta** (Alpharetta)

---

## ✨ Key Features

### 👤 User Portal
*   **Office Selection**: Clear selection of the desired office location.
*   **Two-Step Booking Form**:
    *   *Step 1*: Personal & Vehicle Details (differentiating between Employees and Visitors).
    *   *Step 2*: Schedule Selection (supporting single dates or date ranges, in/out time details).
*   **Input Validation**: Enforces exact formats for names, 10-digit mobile numbers, and `@vdartinc.com` or `@vdartacademy.com` email domains for security.
*   **Booking History & Tracking**: Quick lookup using email or mobile number to track booking statuses.

### 🔑 Admin Portal
*   **Secure Authentication**: Database-backed admin verification with default admin seeding (`admin@vdartinc.com`).
*   **Live Analytics Dashboard**: At-a-glance metrics for total slots, available slots, under-maintenance slots, pending approvals, and approved/rejected/cancelled status counts.
*   **Vetting/Approvals Queue**: Approve, reject, or edit pending booking requests directly.
*   **Parking Slots Grid**: Visual, color-coded dashboard of parking slots categorized by 4-wheeler and 2-wheeler.
*   **Office Master Manager**: Management console for adding or removing office locations.
*   **Admin Management**: Interface to create and assign roles to new administrators.

---

## 🛠️ Technology Stack

### Frontend
*   **React (v19)**: Component-driven UI.
*   **Vite**: Modern build tool and server with HMR.
*   **Vite Basic SSL Plugin**: Enables serving the frontend over secure HTTPS locally.
*   **Vanilla CSS**: High-performance glassmorphic UI styled for premium aesthetics.

### Backend
*   **Node.js & Express**: RESTful API endpoints.
*   **Sequelize ORM**: Object-relational mapping.
*   **SQLite3**: Serverless SQL database stored locally (`backend/database.sqlite`).

---

## 📁 Project Structure

```text
parking_management/
├── backend/
│   ├── database.sqlite       # SQLite local database file (generated on start)
│   ├── package.json          # Node dependencies & scripts for backend
│   └── server.js             # Express app setup, models (Booking, Admin), and API endpoints
├── frontend/
│   ├── src/
│   │   ├── components/       # React components (BookingForm, AdminDashboard, etc.)
│   │   ├── assets/           # Client-side static assets
│   │   ├── App.jsx           # Main routing & state controller
│   │   ├── index.css         # Styling system & theme variables
│   │   └── main.jsx          # Entry point
│   ├── package.json          # Vite & React dependencies & scripts
│   ├── vite.config.js        # Vite config with HTTPS and proxy setup
│   └── README.md             # Vite default documentation
└── dev.sh                    # Automated helper script to run the local dev environment
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
*   [Node.js](https://nodejs.org/) (version 18+ recommended)
*   [npm](https://www.npmjs.com/) (installed with Node.js)
*   Google Chrome (or another browser, updating target in `dev.sh` if needed)

### Easy Launch (Recommended)
The project includes a `dev.sh` script in the root directory that automatically installs dependencies for both frontend and backend, starts the servers, and opens the frontend in Google Chrome.

1.  Make the script executable (if needed):
    ```bash
    chmod +x dev.sh
    ```
2.  Run the script:
    ```bash
    ./dev.sh
    ```
3.  Stop both servers and clean up backend/frontend tasks:
    *   Press `Ctrl + C` in the running terminal.

---

### Manual Setup

If you prefer starting the backend and frontend services separately:

#### 1. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Express server:
    ```bash
    node server.js
    ```
    The server will run at [http://localhost:5001](http://localhost:5001). SQLite database tables will be initialized, and a default administrator account will be seeded automatically.

#### 2. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    The development server will run at [https://localhost:5173/](https://localhost:5173/).

---

## 🔒 Default Administrator Credentials

*   **Username / Email**: `admin@vdartinc.com`
*   **Password**: `admin`
*   **Admin Code**: `MASTER`
*   **Role**: `Super Admin`
