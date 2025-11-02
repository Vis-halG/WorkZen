// ModalContent.js

import React from 'react';

const ModalContent = ({ data, closeModal, index, profileFormData, handleFormChange, handleSaveProfile, handleEditClick, handleDeleteProfile, isEditing, setIsEditing, setProfileFormData, avatars }) => {
    
    if (data && !isEditing) {
      // --- Profile View ---
      return (
        <div className="profile-view-content">
          <img
            src={data.avatar}
            alt={data.name}
            className="profile-avatar-display"
          />
          <h2>{data.name}</h2>
          <p className="profile-profession">{data.profession}</p>
          <p className="profile-contact">Contact: {data.contact}</p>
          
          <div className="modal-actions profile-actions">
            <button 
              type="button"
              onClick={handleEditClick} 
              className="edit-btn"
            >
              Edit Profile
            </button>
            <button 
              type="button"
              onClick={handleDeleteProfile} 
              className="delete-btn"
            >
              Delete
            </button>
          </div>
          <button onClick={closeModal} className="close-btn-footer">
            Close
          </button>
        </div>
      );
    } else {
      // --- Empty Slot (Add Form) OR Filled Slot (Edit Form) ---
      const isNewProfile = !data;
      const title = isNewProfile ? `Create New Profile (Slot ${index})` : `Edit Profile: ${profileFormData.name}`;

      return (
        <div className="slot-form-content">
          <h2>{title}</h2>
          <form className="modal-form" onSubmit={handleSaveProfile}>
            <input 
              type="text" 
              placeholder="Full Name" 
              name="name" 
              value={profileFormData.name} 
              onChange={handleFormChange}
              required 
            />
            <input 
              type="text" 
              placeholder="Profession" 
              name="profession" 
              value={profileFormData.profession} 
              onChange={handleFormChange}
              required 
            />
            <input 
              type="email" 
              placeholder="Contact Email" 
              name="contact" 
              value={profileFormData.contact} 
              onChange={handleFormChange}
              required 
            />
            
            <div className="avatar-picker">
              <p>Choose Avatar</p>
              <div className="avatar-list">
                {avatars.map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt={`Avatar ${i + 1}`}
                    className={`avatar-option ${profileFormData.avatar === avatar ? "selected" : ""}`}
                    onClick={() => setProfileFormData(prev => ({ ...prev, avatar: avatar }))}
                  />
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="save-btn">
                {isNewProfile ? "Save Profile" : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={isNewProfile ? closeModal : () => setIsEditing(false)} 
                className="cancel-btn"
              >
                {isNewProfile ? "Cancel" : "Back to View"}
              </button>
            </div>
          </form>
        </div>
      );
    }
  };

export default ModalContent;