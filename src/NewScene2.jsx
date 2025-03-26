import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GetData from './GetData';

const NewScene2 = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [numTeachers, setNumTeachers] = useState('');
  const [numDivisions, setNumDivisions] = useState('');
  const [numBreaks, setNumBreaks] = useState('');

  const handleNext = () => {
    // Save the title
    GetData.Title = title;
    
    try {
      const teachersNum = parseInt(numTeachers);
      const divisionsNum = parseInt(numDivisions);
      const breaksNum = parseInt(numBreaks);
      
      // Save the numeric values
      GetData.NoTeacher = teachersNum;
      GetData.NoDivision = divisionsNum;
      GetData.NoBreaks = breaksNum;
      
      console.log("Data saved:", {
        title: GetData.Title,
        noTeacher: GetData.NoTeacher,
        noDivision: GetData.NoDivision,
        noBreaks: GetData.NoBreaks
      });
      
      // Navigate to CombinedJavaFXApplication
      navigate('/combinedjavafxapplication');
    } catch (e) {
      console.error("Error parsing numbers:", e);
      alert("Please enter valid numbers for Teachers, Divisions, and Breaks");
    }
  };

  // Label style to reuse across labels
  const labelStyle = {
    fontSize: '18px',
    position: 'absolute'
  };

  return (
    <div style={{
      width: '756px',
      height: '477px',
      position: 'relative',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      <label style={{
        fontSize: '20px',
        position: 'absolute',
        left: '209px',
        top: '28px',
        width: '382px',
        textDecoration: 'underline'
      }}>Please Fill The Information Below</label>
      
      <label style={{...labelStyle, left: '38px', top: '80px'}}>Title ::</label>
      <input 
        type="text" 
        style={{
          position: 'absolute',
          left: '217px',
          top: '80px',
          width: '280px',
          height: '30px',
          padding: '0 5px'
        }} 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      
      <label style={{...labelStyle, left: '39px', top: '160px'}}>Number of Teachers</label>
      <input 
        type="text" 
        style={{
          position: 'absolute',
          left: '217px',
          top: '160px',
          width: '280px',
          height: '30px',
          padding: '0 5px'
        }} 
        value={numTeachers} 
        onChange={(e) => setNumTeachers(e.target.value)} 
      />
      
      <label style={{...labelStyle, left: '38px', top: '240px'}}>Number of Divisions</label>
      <input 
        type="text" 
        style={{
          position: 'absolute',
          left: '217px',
          top: '240px',
          width: '280px',
          height: '30px',
          padding: '0 5px'
        }} 
        value={numDivisions} 
        onChange={(e) => setNumDivisions(e.target.value)} 
      />
      
      <label style={{...labelStyle, left: '38px', top: '320px'}}>total Breaks :</label>
      <input 
        type="text" 
        style={{
          position: 'absolute',
          left: '217px',
          top: '320px',
          width: '280px',
          height: '30px',
          padding: '0 5px'
        }} 
        value={numBreaks} 
        onChange={(e) => setNumBreaks(e.target.value)} 
      />
      
      <label style={{
        fontSize: '22px',
        position: 'absolute',
        left: '120px',
        top: '350px'
      }}>Each Teacher will Teach Only 1 Subject in 1 Division</label>
      
      <button 
        style={{
          position: 'absolute',
          left: '345px',
          top: '414px',
          padding: '8px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#e0e0e0',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }} 
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default NewScene2;