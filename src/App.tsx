import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Login from './components/Login';
import SignUp from './components/Signup';

import DashboardLayout from './components/DashboardLayout';

import Dashboard from './components/Dashboard'; // ✅ Import your main dashboard page
import DigitalRecords from './components/pages/DigitalRecords';
import CustomerManagement from './components/pages/CustomerManagement';
import BusinessReports from './components/pages/BusinessReports';
import SecureSafe from './components/pages/SecureSafe';
import Profile from './components/pages/Profile';
import Notifications from './components/pages/Notifications';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Hero />
                <Features />
              </>
            }
          />

          {/* Auth Pages */}
          <Route
            path="/login"
            element={
              <>
                <Header />
                <Login />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Header />
                <SignUp />
              </>
            }
          />

          {/* Dashboard with Nested Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} /> {/* ✅ Default dashboard route */}
            <Route path="records" element={<DigitalRecords />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="reports" element={<BusinessReports />} />
            <Route path="security" element={<SecureSafe />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
