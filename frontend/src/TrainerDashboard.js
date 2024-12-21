import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TrainerDashboard() {
  const [trainerData, setTrainerData] = useState(null); // Trainer data state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const navigate = useNavigate(); // Navigation hook

  // Fetch Trainer Data
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const token = localStorage.getItem('token'); // Fetch token
        if (!token) {
          navigate('/trainer-register'); // Redirect if no token
          return;
        }

        const response = await fetch('http://localhost:5000/api/trainer-dashboard', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setTrainerData(data.data); // Display trainer data
        } else {
          setError(data.message || 'Failed to fetch trainer data.');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainerData();
  }, [navigate]);

  // Loading State
  if (loading) return <p>Loading...</p>;

  // Error State
  if (error) return <p>Error: {error}</p>;

  // Render Trainer Dashboard
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome, {trainerData?.trainer.username}</h1>
      <h2>Your Role: {trainerData?.trainer.role}</h2>
      <h3>Courses You're Teaching:</h3>
      <ul>
        {trainerData?.courses.map((course) => (
          <li key={course.id}>
            <strong>{course.title}</strong> - {course.students} students enrolled
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrainerDashboard;
