import React, { useEffect, useState } from 'react';
import API from '../api/api';



const Dashboard = () => {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const res = await API.get('/energy-data/'); // adjust endpoint as needed
        setReadings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReadings();
  }, []);

  return (
    <div>
      <h2>Power Readings</h2>
      <ul>
        {readings.map((r, idx) => (
           <li key={idx}>
            
            {/* show the field you want, e.g. r.power */}
            {r.power.toFixed(2)} W
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
