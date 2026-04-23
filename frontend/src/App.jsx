import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import CustomerDashboardLayout from './layouts/CustomerDashboardLayout';
import CustomerDashboard from './pages/CustomerDashboard';
import SellerDashboardLayout from './layouts/SellerDashboardLayout';
import SellerDashboard from './pages/SellerDashboard';
import AgentDashboardLayout from './layouts/AgentDashboardLayout';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Customer Routing */}
        <Route path="/dashboard" element={<CustomerDashboardLayout />}>
          <Route index element={<CustomerDashboard />} />
        </Route>
        
        {/* Seller Routing */}
        <Route path="/seller-dashboard" element={<SellerDashboardLayout />}>
          <Route index element={<SellerDashboard />} />
        </Route>

        {/* Agent Routing */}
        <Route path="/agent-dashboard" element={<AgentDashboardLayout />}>
          <Route index element={<AgentDashboard />} />
        </Route>

        {/* Admin Routing */}
        <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
