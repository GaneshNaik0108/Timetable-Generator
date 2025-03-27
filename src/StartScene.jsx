import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartScene = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/newscene2');
    console.log('Navigating to NewScene2');
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f4f8', // Soft blue-gray background
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        position: 'relative',
        width: '800px',
        height: '500px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Left Side - Image */}
        <div style={{
          width: '50%',
          position: 'relative',
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
        }}>
          <img
            src="/images/timetable_4.jpg"
            alt="Timetable"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.7
            }}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white'
          }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '15px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Timetable
            </h1>
            <p style={{ 
              fontSize: '1rem', 
              maxWidth: '250px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Simplify your scheduling with our intuitive Timetable Generator
            </p>
          </div>
        </div>

        {/* Right Side - Start Button */}
        <div style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px'
        }}>
          <h2 style={{
            marginBottom: '30px',
            color: '#2c3e50',
            fontSize: '1.8rem'
          }}>
            Welcome
          </h2>
          <button
            onClick={handleGetStarted}
            style={{
              width: '250px',
              padding: '15px 25px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#3498db',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.backgroundColor = '#2980b9';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.backgroundColor = '#3498db';
            }}
          >
            Generate Timetable
          </button>
          <p style={{
            marginTop: '20px',
            color: '#7f8c8d',
            textAlign: 'center',
            maxWidth: '300px'
          }}>
            Create efficient and organized schedules with just a few clicks
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartScene;