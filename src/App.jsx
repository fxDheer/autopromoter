import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import GeneratePosts from './pages/GeneratePosts';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate-posts" element={<GeneratePosts />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App; 