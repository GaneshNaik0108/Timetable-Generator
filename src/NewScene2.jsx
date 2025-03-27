import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GetData from './GetData';

const NewScene2 = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [numTeachers, setNumTeachers] = useState('');
  const [numDivisions, setNumDivisions] = useState('');
  const [startTime, setStartTime] = useState('');
  const [lectureDuration, setLectureDuration] = useState('');
  const [breakDuration, setBreakDuration] = useState('');

  const handleNext = () => {
    // Comprehensive validation
    const errors = [];

    if (!title.trim()) {
      errors.push('Please enter a title for your timetable');
    }

    try {
      const teachersNum = parseInt(numTeachers);
      const divisionsNum = parseInt(numDivisions);
      
      // Validate numeric inputs
      if (isNaN(teachersNum) || teachersNum <= 0) {
        errors.push('Please enter a valid number of teachers');
      }
      
      if (isNaN(divisionsNum) || divisionsNum <= 0) {
        errors.push('Please enter a valid number of divisions');
      }

      // Validate time-related inputs
      if (!startTime) {
        errors.push('Please enter a start time');
      }

      const lecDuration = parseInt(lectureDuration);
      if (isNaN(lecDuration) || lecDuration <= 0) {
        errors.push('Please enter a valid lecture duration');
      }

      const breakDur = parseInt(breakDuration);
      if (isNaN(breakDur) || breakDur < 0) {
        errors.push('Please enter a valid break duration');
      }

      // Display errors if any
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      // Save the data
      GetData.Title = title;
      GetData.NoTeacher = teachersNum;
      GetData.NoDivision = divisionsNum;
      GetData.StartTime = startTime;
      GetData.LectureDuration = lecDuration;
      GetData.NoBreaks = breakDur;
      
      console.log("Data saved:", {
        title: GetData.Title,
        noTeacher: GetData.NoTeacher,
        noDivision: GetData.NoDivision,
        startTime: GetData.StartTime,
        lectureDuration: GetData.LectureDuration,
        breakDuration: GetData.NoBreaks
      });
      
      // Navigate to next scene
      navigate('/combinedjavafxapplication');
    } catch (e) {
      console.error("Error processing inputs:", e);
      alert("Please check your inputs and try again");
    }
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
          Timetable Configuration
        </h2>

        {/* Timetable Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#34495e',
            fontWeight: '600'
          }}>
            Timetable Title
          </label>
          <input 
            type="text" 
            placeholder="Enter timetable name"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #bdc3c7',
              fontSize: '16px',
              transition: 'border-color 0.3s ease'
            }} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        
        {/* Numeric Input Fields */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '20px' 
        }}>
          <div style={{ width: '30%' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#34495e',
              fontWeight: '600'
            }}>
              Teachers
            </label>
            <input 
              type="number" 
              placeholder="No."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #bdc3c7',
                fontSize: '16px'
              }} 
              value={numTeachers} 
              onChange={(e) => setNumTeachers(e.target.value)} 
            />
          </div>
          
          <div style={{ width: '30%' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#34495e',
              fontWeight: '600'
            }}>
              Divisions
            </label>
            <input 
              type="number" 
              placeholder="No."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #bdc3c7',
                fontSize: '16px'
              }} 
              value={numDivisions} 
              onChange={(e) => setNumDivisions(e.target.value)} 
            />
          </div>
        </div>

        {/* Time-related Inputs in One Line */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '20px' 
        }}>
          <div style={{ width: '30%' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#34495e',
              fontWeight: '600'
            }}>
              Start Time
            </label>
            <input 
              type="time" 
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #bdc3c7',
                fontSize: '16px'
              }} 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
            />
          </div>
          
          <div style={{ width: '30%' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#34495e',
              fontWeight: '600'
            }}>
              Lecture (min)
            </label>
            <input 
              type="number" 
              placeholder="Dur."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #bdc3c7',
                fontSize: '16px'
              }} 
              value={lectureDuration} 
              onChange={(e) => setLectureDuration(e.target.value)} 
            />
          </div>
          
          <div style={{ width: '30%' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#34495e',
              fontWeight: '600'
            }}>
              Break (min)
            </label>
            <input 
              type="number" 
              placeholder="Dur."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #bdc3c7',
                fontSize: '16px'
              }} 
              value={breakDuration} 
              onChange={(e) => setBreakDuration(e.target.value)} 
            />
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#2c3e50'
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Note: Each teacher will teach only 1 subject in 1 division
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
          Generate Timetable
        </button>
      </div>
    </div>
  );
};

export default NewScene2;