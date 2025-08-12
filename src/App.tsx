import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import ScrollToHash from './components/scroll';

import Login from './components/Login';
import SignUp from './components/Signup';

import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';

import DigitalRecords from './components/pages/DigitalRecords';
import CustomerManagement from './components/pages/CustomerManagement';
import DueTracker from './components/pages/DueTracker';
import Profile from './components/pages/Profile';
import Notifications from './components/pages/Notifications';
import EditProfile from './components/pages/Editprofile';
import ChangePassword from './components/pages/changepassword';

import Features from './components/Features';
import AboutUs from './components/AboutUs';
import Pricing from './components/Pricing'; // ✅ Updated Functional Pricing Page

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <ScrollToHash />

        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Hero />
              </>
            }
          />

          {/* Features Page */}
          <Route
            path="/features"
            element={
              <>
                <Header />
                <Features />
              </>
            }
          />

          {/* About Page */}
          <Route
            path="/about"
            element={
              <>
                <Header />
                <AboutUs />
              </>
            }
          />

          {/* ✅ Functional Pricing Page with Get Started Modal */}
          <Route
            path="/pricing"
            element={
              <>
                <Header />
                <Pricing />
              </>
            }
          />

          {/* Auth Pages */}
          <Route path="/login" element={<><Header /><Login /></>} />
          <Route path="/signup" element={<><Header /><SignUp /></>} />

          {/* Dashboard Pages */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="records" element={<DigitalRecords />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="dues" element={<DueTracker />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="profile/password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;