import React, { useEffect, useState, useRef } from 'react';
import TimeTableGenerator2 from './TimeTableGenerator2';
import GetData from './GetData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to convert time
const convertTime = (hours, minutes) => {
  // Normalize hours and minutes
  let normalizedHours = hours;
  let normalizedMinutes = minutes;
  // Handle minute overflow
  if (normalizedMinutes >= 60) {
    normalizedHours += Math.floor(normalizedMinutes / 60);
    normalizedMinutes %= 60;
  }
  // Convert to 12-hour format
  let period = 'AM';
  if (normalizedHours >= 12) {
    period = 'PM';
    if (normalizedHours > 12) {
      normalizedHours -= 12;
    }
  }
  // Handle midnight/noon special cases
  if (normalizedHours === 0) normalizedHours = 12;
  // Format hours and minutes with leading zeros
  const formattedHours = normalizedHours.toString().padStart(2, '0');
  const formattedMinutes = normalizedMinutes.toString().padStart(2, '0');
  return {
    time: `${formattedHours}:${formattedMinutes} ${period}`,
    hours: normalizedHours,
    minutes: normalizedMinutes,
    period
  };
};

const TimeTableDisplay = () => {
  const [timeTableData, setTimeTableData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [timeSlots, setTimeSlots] = useState([]);
  const divisionRefs = useRef([]); 

  // PDF Download Handler
  const handleDownloadPDF = () => {
    if (!divisionRefs.current || divisionRefs.current.length === 0) {
      console.error('No division references found');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    divisionRefs.current.forEach((divRef, index) => {
      if (divRef) {
        html2canvas(divRef, { 
          scale: 2, 
          useCORS: true 
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfImageWidth = pdfWidth - 20; // Margin
          const pdfImageHeight = (imgProps.height * pdfImageWidth) / imgProps.width;

          // Add page if not first division
          if (index > 0) {
            pdf.addPage();
          }

          pdf.addImage(
            imgData, 
            'PNG', 
            10, // X coordinate 
            10, // Y coordinate
            pdfImageWidth, 
            pdfImageHeight
          );
        });
      }
    });

    // Slight delay to ensure all canvases are processed
    setTimeout(() => {
      pdf.save(`Timetable_${new Date().toISOString().slice(0,10)}.pdf`);
    }, 1000);
  };

  useEffect(() => {
    const generateTimeSlots = () => {
      const startTime = GetData.StartTime || '09:00';
      const lectureDuration = 60; // 1 hour lectures
      const lunchDuration = 60; // 1 hour lunch break
      
      // Parse start time
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      
      const slots = [];
      let currentHours = startHours;
      let currentMinutes = startMinutes;
      
      // Generate time slots
      for (let i = 0; i < 7; i++) {
        // If it's the 4th iteration (middle of the day), insert lunch break
        if (i === 3) {
          // Calculate lunch start and end times
          const lunchStartTime = convertTime(currentHours, currentMinutes);
          const lunchEndTime = convertTime(currentHours, currentMinutes + lunchDuration);
          
          const timeSlotLabel = `Lunch & Break (${lunchStartTime.time}-${lunchEndTime.time})`;
          slots.push(timeSlotLabel);
          
          // Move time forward by lunch duration
          currentMinutes += lunchDuration;
        } else {
          // Calculate lecture end time (1 hour duration)
          let endHours = currentHours;
          let endMinutes = currentMinutes + lectureDuration;
          
          // Convert current and end times
          const startTimeObj = convertTime(currentHours, currentMinutes);
          const endTimeObj = convertTime(endHours, endMinutes);
          
          const timeSlotLabel = `${startTimeObj.time}-${endTimeObj.time}`;
          slots.push(timeSlotLabel);
          
          // Prepare for next slot
          currentMinutes = endMinutes;
        }
        
        // Normalize hours and minutes
        currentHours += Math.floor(currentMinutes / 60);
        currentMinutes %= 60;
      }
      return slots;
    };

    // Set time slots when component mounts
    const dynamicTimeSlots = generateTimeSlots();
    setTimeSlots(dynamicTimeSlots);
  }, [refreshKey]);

  useEffect(() => {
    generateTimetable();
  }, [timeSlots]); // Regenerate when time slots change

  const generateTimetable = () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Initializing timetable generation");
      
      // Ensure we have valid inputs
      if (GetData.NoDivision <= 0) {
        GetData.NoDivision = 3;
        console.log("Set default division count:", GetData.NoDivision);
      }
      
      if (GetData.NoTeacher <= 0) {
        GetData.NoTeacher = 6;
        console.log("Set default teacher count:", GetData.NoTeacher);
      }
      
      // Setup default title if empty
      if (GetData.Title === "") {
        GetData.Title = "Generated Timetable";
        console.log("Set default title:", GetData.Title);
      }
      
      // Generate the timetable
      const generator = new TimeTableGenerator2();
      const generatedData = generator.GetValuesFromRandom();
      console.log("Timetable generated:", generatedData);
      
      // Set the timetable data for rendering
      setTimeTableData(generatedData);
      setIsLoading(false);
    } catch (err) {
      console.error("Error generating timetable:", err);
      setError(`Error generating timetable: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Handle regenerate click
  const handleRegenerateClick = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const createGridPane = (divisionIndex) => {
    // Days array for column headers
    const days = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Grid styles
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gridTemplateRows: `repeat(${timeSlots.length + 1}, 1fr)`,
      border: '1px solid black',
      width: '100%',
      minHeight: '540px',
    };
    
    // Cell styles
    const cellStyle = {
      border: '1px solid black',
      padding: '8px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      whiteSpace: 'pre-line'
    };
    
    // Header cell style
    const headerCellStyle = {
      ...cellStyle,
      fontWeight: 'bold',
      backgroundColor: '#f0f0f0'
    };

    if (isLoading) {
      return <div style={{ textAlign: 'center', padding: '20px' }}>Loading timetable data...</div>;
    }

    if (error) {
      return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;
    }

    if (!timeTableData) {
      return <div style={{ textAlign: 'center', padding: '20px' }}>No timetable data available. Please regenerate.</div>;
    }

    try {
      // Safety check that the division exists
      if (!timeTableData[divisionIndex]) {
        return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          Division {divisionIndex + 1} data not available.
        </div>;
      }

      return (
        <div style={gridStyle}>
          {/* Generate the header row (days) */}
          {days.map((day, colIndex) => (
            <div key={`header-${colIndex}`} style={headerCellStyle}>
              {day}
            </div>
          ))}
          
          {/* Generate the time slots and timetable cells */}
          {timeSlots.map((timeSlot, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {/* Time slot cell */}
              <div 
                style={{
                  ...cellStyle, 
                  gridColumn: '1', 
                  gridRow: `${rowIndex + 2}`,
                  fontWeight: 'bold',
                  backgroundColor: timeSlot.toLowerCase().includes('lunch & break') ? '#FFE6B3' : '#f0f0f0'
                }}
              >
                {timeSlot}
              </div>
              
              {/* Subject cells for each day */}
              {Array.from({ length: 6 }, (_, colIndex) => {
                const day = colIndex + 1;
                const period = rowIndex + 1;
                
                const cellContent = timeTableData[divisionIndex] && 
                                   timeTableData[divisionIndex][day] && 
                                   timeTableData[divisionIndex][day][period] || '';
                
                let backgroundColor = '#ffffff';
                if (cellContent) {
                  if (timeSlot.toLowerCase().includes('lunch & break')) {
                    backgroundColor = '#FFE6B3'; // Light orange for lunch & break
                  } else {
                    backgroundColor = '#e6f7ff'; // Light blue for normal classes
                  }
                }
                
                return (
                  <div 
                    key={`cell-${rowIndex}-${colIndex}`} 
                    style={{
                      ...cellStyle, 
                      gridColumn: `${colIndex + 2}`, 
                      gridRow: `${rowIndex + 2}`,
                      backgroundColor
                    }}
                  >
                    {cellContent}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      );
    } catch (err) {
      console.error("Error rendering division:", err);
      return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
        Error displaying division {divisionIndex + 1}: {err.message}
      </div>;
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{GetData.Titledata()}</h1>
      
      {/* Error display */}
      {error && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ffebee', 
          border: '1px solid #ffcdd2',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <p style={{ fontWeight: 'bold', color: '#d32f2f' }}>Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Action buttons - Regenerate and Download PDF */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px', 
        marginBottom: '20px' 
      }}>
        <button 
          onClick={handleRegenerateClick}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Regenerate Timetable
        </button>
        
        <button 
          onClick={handleDownloadPDF}
          disabled={isLoading || !timeTableData}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading || !timeTableData ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            opacity: isLoading || !timeTableData ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download PDF
        </button>
      </div>
      
      {/* Timetable content with individual division containers */}
      <div style={{ 
        maxHeight: '800px', 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '40px',
        padding: '10px',
        backgroundColor: 'white'
      }}>
        {/* Create multiple timetables based on division count in correct order */}
        {Array.from({ length: GetData.Divisiondata() || 3 }, (_, index) => {
          return (
            <div 
              key={`division-${index}`}
              ref={el => divisionRefs.current[index] = el}
              style={{
                marginBottom: '30px',
                pageBreakInside: 'avoid',
                backgroundColor: 'white',
                padding: '10px'
              }}
            >
              <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>
                Division {index + 1}
              </h2>
              {createGridPane(index)}
            </div>
          );
        })}
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
          }}>
            <p>Generating timetable...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTableDisplay;