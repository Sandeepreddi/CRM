import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Leads from './components/pages/Leads';
import Dashboard from './components/pages/Dashboard';
import Profile from './components/pages/Profile';

function AppContent() {
  const location = useLocation();

  // Hide Navbar on `/leads/:id`
  const hideNavbar = /^\/leads\/[^/]+$/.test(location.pathname);

  return (
    <div className="flex min-h-screen">
      {!hideNavbar && <Navbar />}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
