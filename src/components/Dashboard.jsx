// src/components/Dashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [readings, setReadings] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  

  const fetchReadings = async () => {
    try {
      const res = await API.get('/energy-data/' );
      const newReadings = res.data;
      console.log('API response:', newReadings);

      // Combine new readings with previous, deduplicate by timestamp, sort by newest, and keep top 5
      setReadings((prev) => {
        const combined = [...newReadings, ...prev];
        const deduped = Array.from(
          new Map(combined.map((r) => [r.timestamp, r])).values()
        );
        const sorted = deduped.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        return sorted.slice(0, 5);
      });
    } catch (err) {
      console.error('Error fetching readings:', err);
    }
  };

  useEffect(() => {
    fetchReadings();
    const id = setInterval(() => {
      window.location.reload();
      fetchReadings();
    }, 5000);

    return () => clearInterval(id);
  }, []);

const handleLogout = async () => {
  const accessToken = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    await API.post(
      '/auth/token/logout/',
      { refresh: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('Logout failed:', err);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('login', { replace: true }); 
  }
};


  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Power Readings</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <ul className="readings-list">
        {readings.length === 0 ? (
          <li className="reading-item">No readings available.</li>
        ) : (
          readings.map((r, index) => (
            <li key={`${r.timestamp || index}`} className="reading-item">
              <span className="reading-value">
                {typeof r.power === 'number' ? r.power.toFixed(2) : '0.00'} W
              </span>
              <span className="reading-meta">
                {typeof r.voltage === 'number' ? r.voltage.toFixed(2) : '0.00'} V,{' '}
                {typeof r.current === 'number' ? r.current.toFixed(4) : '0.0000'} A,{' '}
                {typeof r.energy === 'number' ? r.energy.toFixed(4) : '0.0000'} kWh
              </span>
              <span className="reading-time">
                {r.timestamp && !isNaN(new Date(r.timestamp))
                  ? new Date(r.timestamp).toLocaleTimeString()
                  : 'Timestamp missing'}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Dashboard;