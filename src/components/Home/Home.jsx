import React, { useState } from "react";
import "./Home.css";

const Home = () => {
  const circles = [
    { size: "large", top: "10%", left: "10%" },
    { size: "medium", top: "5%", left: "50%" },
    { size: "medium", top: "30%", left: "30%" },
    { size: "extra-large", top: "25%", left: "65%" },
    { size: "extra-large", top: "60%", left: "5%" },
    { size: "small", top: "70%", left: "55%" },
  ];

  const [activeRole, setActiveRole] = useState("Hiring");

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
        {/* Plus Icon */}
        <div className="plus-icon-container">
          <div className="plus-icon">
            <span className="line horizontal"></span>
            <span className="line vertical"></span>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="toggle-button-group">
          <div className={`toggle-bg ${activeRole}`}></div>

          <button
            className={`toggle-btn ${activeRole === "Hiring" ? "active" : ""}`}
            onClick={() => setActiveRole("Hiring")}
          >
            I'm Hiring
          </button>

          <button
            className={`toggle-btn ${activeRole === "Recruiting" ? "active" : ""}`}
            onClick={() => setActiveRole("Recruiting")}
          >
            I'm Recruiting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
