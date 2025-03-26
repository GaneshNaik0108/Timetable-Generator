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
    const numberOfBreaks = GetData.GiveBreaksdata();
    const initialBreakInputs = Array(numberOfBreaks).fill('');
    setBreakInputs(initialBreakInputs);
  }, []);

  const handleNext = () => {
    // Save time data to GetData if needed
    // Here you could add the code to save the time data
    
    // Navigate to CombinedJavaFXApplication
    console.log("Navigating to CombinedJavaFXApplication");
    console.log("Time data:", { startTime, endTime, breakInputs });
    
    navigate('/combinedjavafxapplication');
  };

  // Styles to match the JavaFX layout
  const containerStyle = {
    width: '756px',
    height: '477px',
    position: 'relative',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    padding: '20px'
  };

  const labelStyle = {
    fontSize: '18px',
    position: 'absolute'
  };

  const headerLabelStyle = {
    fontSize: '20px',
    position: 'absolute',
    left: '209px',
    top: '28px',
    width: '382px',
    textDecoration: 'underline'
  };

  const inputStyle = {
    position: 'absolute',
    left: '217px',
    width: '280px',
    height: '30px',
    padding: '0 5px',
    border: '1px solid #ccc',
    borderRadius: '3px'
  };

  const buttonStyle = {
    position: 'absolute',
    left: '345px',
    top: '430px',
    padding: '8px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#e0e0e0',
    border: '1px solid #ccc',
    borderRadius: '4px'
  };

  const handleBreakInputChange = (index, value) => {
    const newBreakInputs = [...breakInputs];
    newBreakInputs[index] = value;
    setBreakInputs(newBreakInputs);
  };

  return (
    <div style={containerStyle}>
      <label style={headerLabelStyle}>Please Enter your Timings</label>
      
      <label style={{...labelStyle, left: '38px', top: '80px'}}> Starting Time :</label>
      <input 
        type="text" 
        style={{...inputStyle, top: '80px'}} 
        placeholder="e.g. 09:00"
        value={startTime} 
        onChange={(e) => setStartTime(e.target.value)} 
      />
      
      <label style={{...labelStyle, left: '38px', top: '160px'}}>Enter the Ending Time</label>
      <input 
        type="text" 
        style={{...inputStyle, top: '160px'}} 
        placeholder="e.g. 17:00"
        value={endTime} 
        onChange={(e) => setEndTime(e.target.value)} 
      />
      
      {/* Dynamic break inputs based on the number of breaks */}
      {breakInputs.map((breakValue, index) => (
        <React.Fragment key={`break-${index}`}>
          <label style={{
            ...labelStyle, 
            left: '38px', 
            top: `${165 + (index + 1) * 45}px`
          }}>
            Break {index + 1}
          </label>
          <input 
            type="text" 
            style={{
              ...inputStyle, 
              top: `${165 + (index + 1) * 45}px`
            }} 
            placeholder="e.g. 12:00-13:00"
            value={breakValue} 
            onChange={(e) => handleBreakInputChange(index, e.target.value)} 
          />
        </React.Fragment>
      ))}
      
      <button 
        style={buttonStyle} 
        onClick={handleNext}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#d0d0d0';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#e0e0e0';
        }}
      >
        Next
      </button>
    </div>
  );
};

export default NewScene3;