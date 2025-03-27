import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetData from './GetData';

const NewScene3 = () => {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breakInputs, setBreakInputs] = useState([]);
  
  useEffect(() => {
    // Initialize break inputs based on the number of breaks from GetData
    const numberOfBreaks = GetData.NoBreaks; // Use the breaks number from GetData
    const initialBreakInputs = Array(numberOfBreaks).fill('');
    setBreakInputs(initialBreakInputs);
  }, []);

  const handleNext = () => {
    // Comprehensive validation
    const errors = [];

    // Validate start and end times
    if (!startTime) {
      errors.push('Please enter a start time');
    }

    if (!endTime) {
      errors.push('Please enter an end time');
    }

    // Validate break times
    const invalidBreaks = breakInputs.some(breakTime => 
      !breakTime.trim() || !breakTime.match(/^\d{2}:\d{2}-\d{2}:\d{2}$/)
    );

    if (invalidBreaks) {
      errors.push('Please enter all break times in HH:MM-HH:MM format');
    }

    // Display errors if any
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Save data to GetData
    GetData.StartTime = startTime;
    GetData.EndTime = endTime;
    GetData.BreakTimes = breakInputs;

    console.log("Time data:", { 
      startTime: GetData.StartTime, 
      endTime: GetData.EndTime, 
      breakTimes: GetData.BreakTimes 
    });

    navigate('/combinedjavafxapplication');
  };

  const handleBreakInputChange = (index, value) => {
    const newBreakInputs = [...breakInputs];
    newBreakInputs[index] = value;
    setBreakInputs(newBreakInputs);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f6f9',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        boxSizing: 'border-box'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2c3e50',
          marginBottom: '30px',
          fontSize: '24px',
          borderBottom: '2px solid #3498db',
          paddingBottom: '10px'
        }}>
          Timetable Timing Details
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#34495e',
            fontWeight: '600'
          }}>
            Starting Time
          </label>
          <input 
            type="time" 
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #bdc3c7',
              fontSize: '16px',
              transition: 'border-color 0.3s ease'
            }}
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#34495e',
            fontWeight: '600'
          }}>
            Ending Time
          </label>
          <input 
            type="time" 
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #bdc3c7',
              fontSize: '16px',
              transition: 'border-color 0.3s ease'
            }}
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
          />
        </div>
        
        {/* Dynamic break inputs */}
        {breakInputs.map((breakValue, index) => (
          <div key={`break-${index}`} style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#34495e',
              fontWeight: '600'
            }}>
              Break {index + 1} Timing
            </label>
            <input 
              type="text" 
              placeholder="HH:MM-HH:MM (e.g. 12:00-13:00)"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #bdc3c7',
                fontSize: '16px',
                transition: 'border-color 0.3s ease'
              }}
              value={breakValue} 
              onChange={(e) => handleBreakInputChange(index, e.target.value)} 
            />
          </div>
        ))}
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#2c3e50'
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Tip: Enter break times in HH:MM-HH:MM format
          </p>
        </div>
        
        <button 
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }} 
          onClick={handleNext}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default NewScene3;