import React, { useState, useRef, useMemo, useCallback } from "react";
import "./Navbar.css";
import { Menu, X } from "lucide-react";
import { State, City } from "country-state-city";

const topNavOptions = [
  { name: "My Profile" },
  { name: "Settings" },
  { name: "Log Out" },
  { name: "Register Yourself on WorkZen" },
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

  const [role, setRole] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Use a single search term for the active dropdown (state or city)
  const [searchTerm, setSearchTerm] = useState(""); 

  // State for the text user sees when nothing is selected/searched
  const [locationPlaceholder, setLocationPlaceholder] =
    useState("Select State"); 

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const cityRef = useRef(null);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const allStates = State.getStatesOfCountry("IN");

  const filteredStates = useMemo(() => {
    if (!searchTerm) return allStates;

    return allStates.filter((state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allStates, searchTerm]);

  const allCities = useMemo(() => {
    return selectedState ? City.getCitiesOfState("IN", selectedState) : [];
  }, [selectedState]);

  const filteredCities = useMemo(() => {
    if (!searchTerm) return allCities;

    return allCities.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCities, searchTerm]);

  const handleMenuClick = () => setMenuOpen((prev) => !prev);

  const calculatePosition = useCallback(() => {
    if (cityRef.current) {
      const rect = cityRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 5,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  const handleLocationInputClick = () => {
    calculatePosition();

    if (!selectedState) {
      // If no state is selected, open state dropdown
      setLocationPlaceholder("Select State");
      setSearchTerm(""); // Clear search term to show all states
      setShowStateDropdown(true);
      setShowCityDropdown(false);
    } else {
      // If state is selected, open city dropdown
      setLocationPlaceholder("Select City");
      setSearchTerm(""); // Clear search term to show all cities
      setShowCityDropdown(true);
      setShowStateDropdown(false);
    }
  };

  const handleLocationInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term); // **UPDATED:** Set the term user is typing
    setSelectedCity(""); // **CRITICAL FIX:** Clear selected city so typing works
    
    calculatePosition();

    if (!selectedState) {
      // Searching for a State
      setLocationPlaceholder("Select State");
      setShowStateDropdown(true);
      setShowCityDropdown(false);
    } else {
      // Searching for a City
      setLocationPlaceholder("Select City");
      setShowCityDropdown(true);
      setShowStateDropdown(false);
    }
  };

  const handleStateSelect = (iso, stateName) => {
    setSelectedState(iso);
    setSelectedCity("");
    setSearchTerm("");
    setShowStateDropdown(false);

    // Set placeholder to prompt for city
    setLocationPlaceholder(`Select City in ${stateName}`); 
    
    calculatePosition();
    // Open City Dropdown shortly after
    setTimeout(() => setShowCityDropdown(true), 100); 
  };

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setSearchTerm(cityName); // Display selected city in input initially
    setShowCityDropdown(false);
    setLocationPlaceholder("Select City"); 
  };
  
  // Determine what text should actually appear in the input field
  const inputText = selectedCity 
    ? selectedCity 
    : searchTerm;

  // Determine what text is used for the mirror element (to calculate width)
  const mirrorText = selectedCity 
    ? selectedCity 
    : (searchTerm || locationPlaceholder);


  return (
    <>
      {/* TOP SEARCH CONTAINER */}
      <div className={`search-container ${menuOpen ? "expanded" : ""}`}>
        <div className="top-bar-content">
          <div className="icon-circle"></div>
          <div className="profile-circle-expandable"></div>

          <div className="filter-box">
            
            {/* AUTO-WIDTH ROLE INPUT */}
            <div className="input-wrapper">
              <span className="input-mirror">
                {role || "Enter role"}
              </span>

              <input
                type="text"
                className="filter-input"
                style={{
                  width: `${(role || "Enter role").length + 1}ch`,
                }}
                placeholder="Enter role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* AUTO-WIDTH CITY/STATE INPUT */}
            <div className="input-wrapper" ref={cityRef}>
              <span className="input-mirror">
                {mirrorText} 
              </span>

              <input
                type="text"
                className="filter-input"
                style={{
                  width: `${mirrorText.length + 1}ch`,
                }}
                placeholder={locationPlaceholder}
                value={inputText}
                onChange={handleLocationInputChange}
                onClick={handleLocationInputClick}
              />
            </div>

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
          <ul className="nav-options open">
            {topNavOptions.map((item) => (
              <li key={item.name}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* STATE DROPDOWN */}
      {showStateDropdown && !selectedState && (
        <ul
          className="dropdown-list"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            position: "fixed",
          }}
        >
          {filteredStates.length > 0 ? (
            filteredStates.map((item) => (
              <li
                key={item.isoCode}
                className="dropdown-item"
                onClick={() => handleStateSelect(item.isoCode, item.name)}
              >
                {item.name}
              </li>
            ))
          ) : (
            <li className="dropdown-item" style={{ cursor: "default", color: "#999" }}>
              No states found
            </li>
          )}
        </ul>
      )}

      {/* CITY DROPDOWN */}
      {showCityDropdown && selectedState && (
        <ul
          className="dropdown-list"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            position: "fixed",
          }}
        >
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <li
                key={city.name}
                className="dropdown-item"
                onClick={() => handleCitySelect(city.name)}
              >
                {city.name}
              </li>
            ))
          ) : (
            <li className="dropdown-item" style={{ cursor: "default", color: "#999" }}>
              No cities found
            </li>
          )}
        </ul>
      )}

      {/* BOTTOM NAV */}
      <div className="nav-container-bottom">
        <div className="nav-bar-bottom">
          {bottomNavItems.map((item) => (
            <button
              key={item.name}
              className={`nav-button-bottom ${
                activeItem === item.name ? "active" : ""
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