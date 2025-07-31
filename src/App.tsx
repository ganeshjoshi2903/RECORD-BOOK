// ✅ App.tsx (updated with correct route path and component)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Login from './components/Login';
import SignUp from './components/Signup';

import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';

import DigitalRecords from './components/pages/DigitalRecords';
import CustomerManagement from './components/pages/CustomerManagement';
import DueTracker from './components/pages/DueTracker'; // ✅ Correct path
import Profile from './components/pages/Profile';
import Notifications from './components/pages/Notifications';
import EditProfile from './components/pages/EditProfile';
import ChangePassword from './components/pages/ChangePassword';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
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

          <Route path="/login" element={<><Header /><Login /></>} />
          <Route path="/signup" element={<><Header /><SignUp /></>} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="records" element={<DigitalRecords />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="dues" element={<DueTracker />} /> {/* ✅ Fixed path */}
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
