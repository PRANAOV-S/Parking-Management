import { useState } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Footer from './components/Footer'
import BookingForm from './components/BookingForm'
import HistoryTracking from './components/HistoryTracking'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [view, setView] = useState('home'); // 'home', 'booking', 'history', 'admin'
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleOfficeSelect = (office) => {
    setSelectedOffice(office);
    setView('booking');
  };

  const handleHomeClick = () => {
    setSelectedOffice(null);
    setView('home');
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = (token) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('home');
  };

  return (
    <div className="app-container">
      <Navbar
        onHomeClick={handleHomeClick}
        onHistoryClick={() => setView('history')}
        onAdminClick={() => setView('admin')}
      />

      {view === 'home' && (
        <HeroSection onOfficeSelect={handleOfficeSelect} />
      )}

      {view === 'booking' && (
        <BookingForm selectedOffice={selectedOffice} onBack={handleHomeClick} />
      )}

      {view === 'history' && <HistoryTracking />}

      {view === 'admin' && (
        !isAuthenticated ? (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <AdminDashboard onLogout={handleLogout} />
        )
      )}

      <Footer />
    </div>
  )
}

export default App
