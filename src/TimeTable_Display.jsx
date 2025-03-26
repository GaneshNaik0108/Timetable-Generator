import React, { useEffect, useState, useRef } from 'react';
import TimeTableGenerator2 from './TimeTableGenerator2';
import GetData from './GetData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TimeTableDisplay = () => {
  const [timeTableData, setTimeTableData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // For forcing re-renders
  const divisionRefs = useRef([]); // References for each division

  useEffect(() => {
    generateTimetable();
  }, [refreshKey]);

  // Properly initialize division refs when division count changes
  useEffect(() => {
    const divCount = GetData.Divisiondata() || 3;
    divisionRefs.current = Array(divCount).fill().map((_, i) => divisionRefs.current[i] || React.createRef());
  }, [timeTableData]);

  const generateTimetable = () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Initializing timetable generation");
      
      // Make sure we have some default values if not set
      if (GetData.NoDivision <= 0) {
        GetData.NoDivision = 3;
        GetData.updateTimeTableDimensions();
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

  // Handle PDF download - individual division approach
// Replace the entire handleDownloadPDF function with this improved version
const handleDownloadPDF = async () => {
  if (!timeTableData || isLoading) {
    alert('Please wait for the timetable to finish loading');
    return;
  }

  // Show loading message
  const loadingIndicator = document.createElement('div');
  loadingIndicator.style.position = 'fixed';
  loadingIndicator.style.top = '50%';
  loadingIndicator.style.left = '50%';
  loadingIndicator.style.transform = 'translate(-50%, -50%)';
  loadingIndicator.style.padding = '20px';
  loadingIndicator.style.background = 'rgba(0,0,0,0.7)';
  loadingIndicator.style.color = 'white';
  loadingIndicator.style.borderRadius = '5px';
  loadingIndicator.style.zIndex = '9999';
  loadingIndicator.textContent = 'Generating PDF, please wait...';
  document.body.appendChild(loadingIndicator);

  try {
    const divCount = GetData.Divisiondata() || 3;
    const title = GetData.Titledata() || 'Generated Timetable';
    
    // Create PDF in landscape orientation for better fit
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Add title to first page
    pdf.setFontSize(16);
    pdf.text(title, pdfWidth / 2, 10, { align: 'center' });
    
    // Generate one division per page in correct order
    for (let i = 0; i < divCount; i++) {
      // Get the division element by reference
      const divElement = divisionRefs.current[i];
      
      if (!divElement) {
        console.warn(`Division ref ${i+1} not available, skipping`);
        continue;
      }
      
      // Add new page for each division after first one
      if (i > 0) {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text(title, pdfWidth / 2, 10, { align: 'center' });
      }
      
      // Temporarily make the division visible if it's scrolled out of view
      const originalPosition = divElement.style.position;
      const originalTop = divElement.style.top;
      const originalLeft = divElement.style.left;
      const originalZIndex = divElement.style.zIndex;
      const originalOpacity = divElement.style.opacity;
      
      // Make sure the element is visible when capturing
      divElement.style.opacity = "1";
      
      // Additional preparation for the capture
      const originalDisplay = divElement.style.display;
      divElement.style.display = 'block';
      
      // Wait for any potential renders to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        // Use html2canvas with better settings
        const canvas = await html2canvas(divElement, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff', // Ensure white background
          removeContainer: false,
          // Ensure we capture all content
          height: divElement.scrollHeight,
          width: divElement.scrollWidth,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight
        });
        
        // Get the image data
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Calculate dimensions with proper aspect ratio while preserving readability
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate ratio to fit on page with margins
        const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 40) / imgHeight);
        
        // Add division number subtitle
        pdf.setFontSize(14);
        pdf.text(`Division ${i+1}`, pdfWidth / 2, 20, { align: 'center' });
        
        // Position image centrally on page
        const xPos = (pdfWidth - imgWidth * ratio) / 2;
        const yPos = 30; // Below title and division number
        
        // Add the image
        pdf.addImage(imgData, 'JPEG', xPos, yPos, imgWidth * ratio, imgHeight * ratio);
        
        // Add page number at bottom
        pdf.setFontSize(10);
        pdf.text(`Page ${i+1} of ${divCount}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      } catch (err) {
        console.error(`Error capturing division ${i+1}:`, err);
        // Add error message to PDF
        pdf.setFontSize(12);
        pdf.setTextColor(255, 0, 0);
        pdf.text(`Error capturing Division ${i+1}: ${err.message}`, 20, 50);
        pdf.setTextColor(0, 0, 0);
      }
      
      // Restore the original styles
      divElement.style.position = originalPosition;
      divElement.style.top = originalTop;
      divElement.style.left = originalLeft;
      divElement.style.zIndex = originalZIndex;
      divElement.style.opacity = originalOpacity;
      divElement.style.display = originalDisplay;
    }
    
    // Add footer with date on the last page
    pdf.setFontSize(10);
    const dateText = `Generated on: ${new Date().toLocaleDateString()}`;
    pdf.text(dateText, pdfWidth - 10, pdfHeight - 10, { align: 'right' });
    
    // Save the PDF
    pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
    
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert(`PDF generation failed: ${err.message}`);
  } finally {
    // Always remove loading indicator
    if (document.body.contains(loadingIndicator)) {
      document.body.removeChild(loadingIndicator);
    }
  }
};


  // Create the grid pane for a specific division
  const createGridPane = (divisionIndex) => {
    // Days array for column headers
    const days = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Time slots array
    const timeSlots = ["9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-12:30", "12:30-1:30", "1:30-2:30", "2:30-3:30"];
    
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
      whiteSpace: 'pre-line' // To preserve newlines in timetable entries
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
                  backgroundColor: '#f0f0f0'
                }}
              >
                {timeSlot}
              </div>
              
              {/* Subject cells for each day */}
              {Array.from({ length: 6 }, (_, colIndex) => {
                const day = colIndex + 1;
                const period = rowIndex + 1;
                
                // Ensure we're accessing the right division's data
                const cellContent = timeTableData[divisionIndex] && 
                                   timeTableData[divisionIndex][day] && 
                                   timeTableData[divisionIndex][day][period] || '';
                
                // Determine background color (special for lunch period)
                let backgroundColor = '#ffffff';
                if (cellContent) {
                  if (period === 4) {
                    backgroundColor = '#ffe6e6'; // Light red for lunch break
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
          // Use the current index to assign a reference
          return (
            <div 
              key={`division-${index}`}
              ref={el => divisionRefs.current[index] = el}
              style={{
                marginBottom: '30px',
                pageBreakInside: 'avoid', // Hint for PDF rendering
                backgroundColor: 'white',
                padding: '10px'
              }}
              // Continuation of the TimeTableDisplay component AFTER THIS LINE 
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
