import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartScene = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    // Navigate to NewScene2 using React Router
    navigate('/newscene2');
    console.log('Navigating to NewScene2');
  };

  return (
    <div style={{
      width: '733px',
      height: '411px',
      position: 'relative',
      margin: '0 auto'
    }}>
      <img
        src="/timetable_4.jpg" // Update this path to match your image location
        alt="Timetable"
        style={{
          width: '733px',
          height: '427px',
          objectFit: 'contain',
          position: 'absolute',
          top: '-1px'
        }}
      />
      <button
        style={{
          position: 'absolute',
          left: '291px',
          top: '335px',
          width: '138px',
          height: '41px',
          fontSize: '18px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          background: 'linear-gradient(to bottom, #f0f0f0, #d0d0d0)',
          border: '1px solid #aaa',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}
        onClick={handleGetStarted}
        onMouseOver={(e) => {
          e.target.style.background = 'linear-gradient(to bottom, #e0e0e0, #c0c0c0)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'linear-gradient(to bottom, #f0f0f0, #d0d0d0)';
        }}
      >
        GET STARTED
      </button>
    </div>
  );
};

export default StartScene;