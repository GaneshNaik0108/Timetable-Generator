import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetData from './GetData';

const CombinedJavaFXApplication = () => {
  const navigate = useNavigate();
  
  // State to store configuration
  const [title, setTitle] = useState(GetData.Title || "Generated Timetable");
  const [teacherCount, setTeacherCount] = useState(GetData.NoTeacher || 6);
  const [divisionCount, setDivisionCount] = useState(GetData.NoDivision || 3);
  
  // State to store teacher and subject inputs
  const [teacherInputs, setTeacherInputs] = useState(Array(teacherCount).fill(""));
  const [subjectInputs, setSubjectInputs] = useState(Array(teacherCount).fill(""));
  
  // Error state
  const [error, setError] = useState(null);
  
  // Initialize data when component mounts
  useEffect(() => {
    try {
      // Initialize GetData if needed
      if (GetData.NoDivision <= 0) {
        GetData.NoDivision = divisionCount;
        GetData.NoTeacher = teacherCount;
        GetData.Title = title;
        GetData.updateTimeTableDimensions();
      }
      
      // Initialize input arrays
      setTeacherInputs(Array(teacherCount).fill(""));
      setSubjectInputs(Array(teacherCount).fill(""));
      
      console.log("CombinedJavaFXApplication initialized");
    } catch (err) {
      console.error("Error initializing:", err);
      setError(`Initialization error: ${err.message}`);
    }
  }, []);
  
  // Handle teacher input changes
  const handleTeacherChange = (index, value) => {
    const newTeacherInputs = [...teacherInputs];
    newTeacherInputs[index] = value;
    setTeacherInputs(newTeacherInputs);
  };
  
  // Handle subject input changes
  const handleSubjectChange = (index, value) => {
    const newSubjectInputs = [...subjectInputs];
    newSubjectInputs[index] = value;
    setSubjectInputs(newSubjectInputs);
  };
  
  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  
  // Handle division count change
  const handleDivisionChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setDivisionCount(value);
    }
  };
  
  // Handle next button click
 // In CombinedJavaFXApplication.jsx, update the handleNextClick function:

// Replace only the handleNextClick function in CombinedJavaFXApplication.jsx:

const handleNextClick = () => {
  try {
    setError(null);
    
    // Update configuration
    GetData.Title = title;  
    GetData.NoDivision = divisionCount;
    GetData.NoTeacher = teacherCount;
    GetData.updateTimeTableDimensions();
    
    // Store teacher names (filter out empty ones, but keep at least the filled ones)
    const filteredTeachers = teacherInputs.filter(t => t.trim() !== "");
    GetData.TotalTeacher = filteredTeachers.length > 0 ? 
      filteredTeachers : 
      Array(teacherCount).fill().map((_, i) => `Teacher ${i+1}`);
    
    // Store subject names (same filtering logic)
    const filteredSubjects = subjectInputs.filter(s => s.trim() !== "");
    GetData.TotalSubject = filteredSubjects.length > 0 ? 
      filteredSubjects : 
      Array(teacherCount).fill().map((_, i) => `Subject ${i+1}`);
    
    console.log("Configuration saved:");
    console.log("- Title:", GetData.Title);
    console.log("- Divisions:", GetData.NoDivision);
    console.log("- Teachers:", GetData.TotalTeacher);
    console.log("- Subjects:", GetData.TotalSubject);
    
    // This must match EXACTLY with the Route path in App.js
    navigate('/TimeTableDisplay');
    
    // If that doesn't work, try one of these alternatives:
    // navigate('/timetable');
    // navigate('/TimeTable_Display');
  } catch (err) {
    console.error("Error preparing timetable data:", err);
    setError(`Failed to prepare timetable data: ${err.message}`);
  }
};
  
  return (
    <div style={{ 
      width: '900px', 
      height: '100%', 
      position: 'relative', 
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginTop: '10px' }}>Timetable Generator</h1>
      
      {/* Error message */}
      {error && (
        <div style={{
          margin: '10px 0',
          padding: '10px',
          backgroundColor: '#ffebee',
          border: '1px solid #ffcdd2',
          borderRadius: '4px',
          color: '#d32f2f'
        }}>
          {error}
        </div>
      )}
      
      {/* Configuration options */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '30px',
        padding: '0 60px'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Timetable Title:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            style={{
              width: '300px',
              height: '34px',
              padding: '0 5px',
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Number of Divisions:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={divisionCount}
            onChange={handleDivisionChange}
            style={{
              width: '150px',
              height: '34px',
              padding: '0 5px',
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}
          />
        </div>
      </div>
      
      {/* Teacher inputs section */}
      <div>
        <label style={{ 
          position: 'absolute', 
          left: '60px', 
          top: '142px', 
          fontSize: '18px'
        }}>
          Enter the Name of Teacher
        </label>
        
        {Array.from({ length: teacherCount }).map((_, i) => (
          <input
            key={`teacher-${i}`}
            type="text"
            value={teacherInputs[i]}
            onChange={(e) => handleTeacherChange(i, e.target.value)}
            placeholder={`Teacher ${i+1}`}
            style={{
              position: 'absolute',
              left: '60px',
              top: `${165 + i * 45}px`,
              width: '300px',
              height: '34px',
              padding: '0 5px',
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}
          />
        ))}
      </div>
      
      {/* Subject inputs section */}
      <div>
        <label style={{ 
          position: 'absolute', 
          left: '473px', 
          top: '142px', 
          fontSize: '18px'
        }}>
          Enter Subject Name
        </label>
        
        {Array.from({ length: teacherCount }).map((_, i) => (
          <input
            key={`subject-${i}`}
            type="text"
            value={subjectInputs[i]}
            onChange={(e) => handleSubjectChange(i, e.target.value)}
            placeholder={`Subject ${i+1}`}
            style={{
              position: 'absolute',
              left: '450px',
              top: `${165 + i * 45}px`,
              width: '300px',
              height: '34px',
              padding: '0 5px',
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}
          />
        ))}
      </div>
      
      {/* Next button */}
      <button
        onClick={handleNextClick}
        style={{
          position: 'absolute',
          left: '374px',
          top: `${165 + teacherCount * 45 + 50}px`,
          padding: '10px 30px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Generate Timetable
      </button>
    </div>
  );
};

export default CombinedJavaFXApplication;