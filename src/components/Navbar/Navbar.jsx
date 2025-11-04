import React, { useState } from "react";
import "./Navbar.css";
import { Menu, X } from "lucide-react";

const topNavOptions = [
  { name: "Home" },
  { name: "My Profile" },
  { name: "Settings" },
  { name: "Log Out" },
];

const bottomNavItems = [
  { name: "Home" },
  { name: "Teams" },
  { name: "Chats" },
  { name: "Store" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  const handleMenuClick = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <div className={`search-container ${menuOpen ? "expanded" : ""}`}>
        <div className="top-bar-content">
          <div className="icon-circle"></div>
          <div className="profile-circle-expandable"></div>
          <div className="search-box">
            <input type="text" placeholder="Search" className="search-input" />
            <button className="menu-icon" onClick={handleMenuClick}>
              {menuOpen ? (
                <X size={24} color="#333" strokeWidth={2.5} />
              ) : (
                <Menu size={24} color="#333" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <ul className="nav-options">
            {topNavOptions.map((item) => (
              <li key={item.name}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="nav-container-bottom">
        <div className="nav-bar-bottom">
          {bottomNavItems.map((item) => (
            <button
              key={item.name}
              className={`nav-button-bottom ${activeItem === item.name ? "active" : ""
                }`}
              onClick={() => setActiveItem(item.name)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
