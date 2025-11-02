import React, { useState } from 'react';
import './Navbar.css'; // Ek naya CSS file use karenge

// --- Data for both components ---
const topNavOptions = [
    { name: 'Home' },
    { name: 'My Profile' },
    { name: 'Settings' },
    { name: 'Log Out' },
];

const bottomNavItems = [
    { name: 'Home' },
    { name: 'Favourite' },
    { name: 'Message' },
    { name: 'Store' },
];

const Navbar = () => {
    // State for Top Search Bar (Expand/Collapse)
    const [menuOpen, setMenuOpen] = useState(false);
    
    // State for Bottom Navigation Bar (Active Button)
    const [activeItem, setActiveItem] = useState('Home');

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            {/* ======================================= */}
            {/* 1. TOP HEADER / SEARCH BAR (from Navbar.jsx) */}
            {/* ======================================= */}
            <div className={`search-container ${menuOpen ? 'expanded' : ''}`}>
                <div className="top-bar-content">
                    {/* Left Circle/Avatar (Static) */}
                    <div className="icon-circle"></div>

                    {/* Profile Circle - Appears and expands when menu is open */}
                    <div className="profile-circle-expandable"></div>

                    <div className="search-box">
                        <input type="text" placeholder="Search" className="search-input" />

                        <button
                            className={`menu-icon ${menuOpen ? 'active' : ''}`}
                            onClick={handleMenuClick}
                        >
                            <span className="line"></span>
                            <span className="line"></span>
                            <span className="line"></span>
                        </button>
                    </div>
                </div>

                {/* Navigation Options (Conditionally Rendered below the search bar) */}
                {menuOpen && (
                    <ul className="nav-options">
                        {topNavOptions.map((item) => (
                            <li key={item.name}>{item.name}</li>
                        ))}
                    </ul>
                )}
            </div>

            {/* =========================================== */}
            {/* 2. BOTTOM NAVIGATION BAR (from Buttons.jsx) */}
            {/* =========================================== */}
            <div className="nav-container-bottom">
                <div className="nav-bar-bottom">
                    {bottomNavItems.map((item) => (
                        <button
                            key={item.name}
                            className={`nav-button-bottom ${activeItem === item.name ? 'active' : ''}`}
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