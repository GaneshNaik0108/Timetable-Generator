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
    if (value > 0 && value <= 10) {
      setDivisionCount(value);
    }
  };
  
  // Enhanced validation method
  const validateInputs = () => {
    const errors = [];

    // Validate title
    if (!title.trim()) {
      errors.push("Timetable title cannot be empty");
    }

    // Validate division count
    if (divisionCount < 1 || divisionCount > 10) {
      errors.push("Number of divisions must be between 1 and 10");
    }

    // Validate unique teacher names
    const uniqueTeachers = new Set(teacherInputs.filter(t => t.trim() !== ""));
    if (uniqueTeachers.size !== teacherInputs.filter(t => t.trim() !== "").length) {
      errors.push("Teacher names must be unique");
    }

    // Validate unique subject names
    const uniqueSubjects = new Set(subjectInputs.filter(s => s.trim() !== ""));
    if (uniqueSubjects.size !== subjectInputs.filter(s => s.trim() !== "").length) {
      errors.push("Subject names must be unique");
    }

    return errors;
  };
  
  // Handle next button click
  const handleNextClick = () => {
    try {
      // Validate inputs before proceeding
      const validationErrors = validateInputs();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(". "));
        return;
      }

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
    } catch (err) {
      console.error("Error preparing timetable data:", err);
      setError(`Failed to prepare timetable data: ${err.message}`);
    }
  };
  
  // Rest of the component remains the same...
  
  return (
      <div style={{ 
        maxWidth: '1200px', 
        width: '95%',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#333',
          fontSize: '2rem'
        }}>
          Timetable Generator
        </h1>
        
        {/* Error message */}
        {error && (
          <div style={{
            margin: '10px 0',
            padding: '15px',
            backgroundColor: '#ffebee',
            border: '1px solid #ffcdd2',
            borderRadius: '5px',
            color: '#d32f2f',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        {/* Configuration options */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'space-between', 
          marginBottom: '30px',
          gap: '15px'
        }}>
          <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px',
              fontWeight: 'bold',
              color: '#555'
            }}>
              Timetable Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px',
              fontWeight: 'bold',
              color: '#555'
            }}>
              Number of Divisions:
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={divisionCount}
              onChange={handleDivisionChange}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>
        
        {/* Teacher and Subject Inputs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'space-between'
        }}>
          {/* Teacher Names Column */}
          <div style={{ 
            flex: '1 1 45%', 
            minWidth: '300px',
            marginBottom: '20px'
          }}>
            <h2 style={{ 
              marginBottom: '15px', 
              textAlign: 'center',
              color: '#333',
              fontSize: '1.2rem'
            }}>
              Enter Teacher Names
            </h2>
            {Array.from({ length: teacherCount }).map((_, i) => (
              <input
                key={`teacher-${i}`}
                type="text"
                value={teacherInputs[i]}
                onChange={(e) => handleTeacherChange(i, e.target.value)}
                placeholder={`Teacher ${i+1}`}
                style={{
                  width: '100%',
                  height: '40px',
                  marginBottom: '10px',
                  padding: '0 10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            ))}
          </div>
          
          {/* Subject Names Column */}
          <div style={{ 
            flex: '1 1 45%', 
            minWidth: '300px',
            marginBottom: '20px'
          }}>
            <h2 style={{ 
              marginBottom: '15px', 
              textAlign: 'center',
              color: '#333',
              fontSize: '1.2rem'
            }}>
              Enter Subject Names
            </h2>
            {Array.from({ length: teacherCount }).map((_, i) => (
              <input
                key={`subject-${i}`}
                type="text"
                value={subjectInputs[i]}
                onChange={(e) => handleSubjectChange(i, e.target.value)}
                placeholder={`Subject ${i+1}`}
                style={{
                  width: '100%',
                  height: '40px',
                  marginBottom: '10px',
                  padding: '0 10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Next button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '20px' 
        }}>
          <button
            onClick={handleNextClick}
            style={{
              padding: '12px 40px',
              fontSize: '18px',
              cursor: 'pointer',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
          >
            Generate Timetable
          </button>
        </div>
      </div>
    );
  };

export default CombinedJavaFXApplication;