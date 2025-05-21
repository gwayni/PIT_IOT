import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [readings, setReadings] = useState([]);
  const [activeTab, setActiveTab] = useState('voltage');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchReadings = async () => {
    try {
      const res = await API.get('/energy-data/');
      const newReadings = res.data;

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

  const handleDownloadCSV = () => {
    const csvHeader = 'Timestamp,Value\n';
    const csvRows = readings
      .slice()
      .reverse()
      .map((r) => `${r.timestamp},${r[activeTab]}`)
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const chartColors = {
    voltage: '#1e3a8a',
    current: '#10b981',
    power: '#f59e0b',
    energy: '#ef4444',
  };

  const isStaleData = () => {
    if (readings.length === 0) return true;
    const latestTimestamp = new Date(readings[0].timestamp);
    const now = new Date();
    const diffInSeconds = (now - latestTimestamp) / 1000;
    return diffInSeconds > 10; // Stale if older than 10 seconds
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Power Readings</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <h1 className="dashboard-title">
        University-Wide Electricity Consumption Monitoring Dashboard
      </h1>

      <div className="table-container">
        <table className="readings-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Voltage (V)</th>
              <th>Current (A)</th>
              <th>Power (W)</th>
              <th>Energy (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {readings.length === 0 || isStaleData() ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="placeholder-row">
                  <td colSpan="5">Awaiting data...</td>
                </tr>
              ))
            ) : (
              readings.map((r, index) => (
                <tr key={`${r.timestamp || index}`}>
                  <td>
                    {r.timestamp && !isNaN(new Date(r.timestamp))
                      ? new Date(r.timestamp).toLocaleTimeString()
                      : 'Timestamp missing'}
                  </td>
                  <td>{typeof r.voltage === 'number' ? r.voltage.toFixed(2) : '0.00'}</td>
                  <td>{typeof r.current === 'number' ? r.current.toFixed(4) : '0.0000'}</td>
                  <td>{typeof r.power === 'number' ? r.power.toFixed(2) : '0.00'}</td>
                  <td>{typeof r.energy === 'number' ? r.energy.toFixed(4) : '0.0000'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="charts-container">
        <h3>Usage Visualization</h3>
        <div className="tabs">
          {['voltage', 'current', 'power', 'energy'].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button className="download-btn" onClick={handleDownloadCSV}>Download CSV</button>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={readings.slice().reverse()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(t) => new Date(t).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip labelFormatter={(l) => new Date(l).toLocaleTimeString()} />
            <Line
              type="monotone"
              dataKey={activeTab}
              stroke={chartColors[activeTab]}
              name={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
