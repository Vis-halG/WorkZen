import React, { useState, useRef } from "react";
import "./Home.css";
// सुनिश्चित करें कि यह फ़ाइल मौजूद है और सही ढंग से इम्पोर्ट की गई है।
import ModalContent from "./ModalContent"; 

const Home = () => {
  const circlesData = [
    { size: "large", top: "10%", left: "10%" },
    { size: "medium", top: "5%", left: "50%" },
    { size: "medium", top: "30%", left: "30%" },
    { size: "extra-large", top: "25%", left: "65%" },
    { size: "extra-large", top: "60%", left: "5%" },
    { size: "small", top: "70%", left: "55%" },
  ];

  const avatars = [
    "/images/avatars/avatar1.png",
    "/images/avatars/avatar2.png",
    "/images/avatars/avatar3.png",
    "/images/avatars/avatar4.png",
  ];

  const [circleData, setCircleData] = useState({
    3: {
      name: "Akash Sharma",
      profession: "UI/UX Designer",
      contact: "akash@example.com",
      avatar: "/images/avatars/avatar3.png",
    },
    0: {
      name: "Priya Singh",
      profession: "Frontend Developer",
      contact: "priya@example.com",
      avatar: "/images/avatars/avatar1.png",
    },
  });

  const [activeCircleIndex, setActiveCircleIndex] = useState(null);
  const [activeRole, setActiveRole] = useState("Hiring");
  const [initialModalRect, setInitialModalRect] = useState(null);
  const [activeProfileData, setActiveProfileData] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);

  const [profileFormData, setProfileFormData] = useState({
    name: "",
    profession: "",
    contact: "",
    avatar: avatars[0],
  });

  const circleRefs = useRef([]);

  // FIX: Focus Trapping Function
  const toggleCircleTabFocus = (disable) => {
      circleRefs.current.forEach(circleEl => {
          if (circleEl) {
              // tabIndex = -1 (disables tabbing) or 0 (enables tabbing)
              circleEl.tabIndex = disable ? -1 : 0; 
          }
      });
  };


  const handleCircleClick = (index) => {
    setActiveCircleIndex(index);
    const data = circleData[index] || null;
    setActiveProfileData(data);
    
    // FIX: मॉडाल खुलने पर, Focus Trapping शुरू करें (सर्किल को non-tabbable बनाएं)
    toggleCircleTabFocus(true);

    if (data) {
        setProfileFormData(data);
        setIsEditing(false); 
    } else {
        setProfileFormData({
            name: "",
            profession: "",
            contact: "",
            avatar: avatars[0],
        });
        setIsEditing(true);
    }

    const clickedCircle = circleRefs.current[index];
    if (clickedCircle) {
      const rect = clickedCircle.getBoundingClientRect();
      setInitialModalRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: "50%",
      });
    }
  };

  const closeModal = () => {
    // FIX: मॉडाल बंद होने पर, Focus Trapping हटाएँ (सर्किल को वापस tabbable बनाएं)
    toggleCircleTabFocus(false);
    
    setActiveCircleIndex(null);
    setInitialModalRect(null);
    setActiveProfileData(null);
    setIsEditing(false);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleEditClick = () => {
    setProfileFormData(activeProfileData);
    setIsEditing(true);
  };

  const handleDeleteProfile = () => {
    if (activeCircleIndex !== null) {
      const { [activeCircleIndex]: deleted, ...rest } = circleData;
      setCircleData(rest);
      closeModal();
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (activeCircleIndex !== null) {
      setCircleData((prevData) => ({
        ...prevData,
        [activeCircleIndex]: profileFormData,
      }));
      closeModal();
    }
  };

  return (
    <div className="card-wrapper">
      <div className="top-section">
        {circlesData.map((circle, index) => {
          const data = circleData[index];
          return (
            <div
              key={index}
              className={`circle ${circle.size}`}
              style={{
                top: circle.top,
                left: circle.left,
                backgroundImage: data?.avatar ? `url(${data.avatar})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: data?.avatar ? "transparent" : "#cccccc",
              }}
              onClick={() => handleCircleClick(index)}
              ref={(el) => (circleRefs.current[index] = el)}
              tabIndex={0} // FIX: सुनिश्चित करें कि ये डिफ़ॉल्ट रूप से टैबेबल हैं
            >
              {!data?.avatar && (
                <span className="circle-placeholder">+</span>
              )}
            </div>
          );
        })}
      </div>

      {activeCircleIndex !== null && initialModalRect && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className={`modal animate-in`}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalContent
              data={activeProfileData}
              closeModal={closeModal}
              index={activeCircleIndex}
              profileFormData={profileFormData}
              handleFormChange={handleFormChange}
              handleSaveProfile={handleSaveProfile}
              handleEditClick={handleEditClick}
              handleDeleteProfile={handleDeleteProfile}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setProfileFormData={setProfileFormData}
              avatars={avatars}
            />
          </div>
        </div>
      )}

      <div className="bottom-section">
        <div className="plus-icon-container">
          <div className="plus-icon">
            <span className="line horizontal"></span>
            <span className="line vertical"></span>
          </div>
        </div>

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