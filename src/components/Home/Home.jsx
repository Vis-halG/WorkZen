import React from 'react';
import './Home.css';

const Home = () => {
  // Mock data for the circles
  const circles = [
    { size: 'large', top: '10%', left: '10%' },
    { size: 'medium', top: '5%', left: '50%' },
    { size: 'medium', top: '30%', left: '30%' },
    { size: 'extra-large', top: '25%', left: '65%' },
    { size: 'extra-large', top: '60%', left: '5%' },
    { size: 'small', top: '70%', left: '55%' },
  ];

  return (
    <div className="card-wrapper">
      <div className="top-section">
        {circles.map((circle, index) => (
          <div
            key={index}
            className={`circle ${circle.size}`}
            style={{ top: circle.top, left: circle.left }}
          ></div>
        ))}
      </div>

      <div className="bottom-section">
        {/* Plus Icon (created using CSS) */}
        <div className="plus-icon-container">
          <div className="plus-icon">
            <span className="line horizontal"></span>
            <span className="line vertical"></span>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button className="card-button primary">I'm Hiring</button>
          <button className="card-button secondary">I'm Recruiting</button>
        </div>
      </div>
    </div>
  );
};

export default Home;