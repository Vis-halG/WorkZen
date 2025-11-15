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

  // New State for State Search Term (used when selectedState is empty)
  const [stateSearchTerm, setStateSearchTerm] = useState(""); 
  const [citySearchTerm, setCitySearchTerm] = useState("");

  const [cityInputPlaceholder, setCityInputPlaceholder] = useState("Select City");

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const cityRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const allStates = State.getStatesOfCountry("IN");
  
  // --- State Filtering Logic ---
  const filteredStates = useMemo(() => {
    if (!stateSearchTerm) {
      return allStates;
    }
    const lowerCaseSearchTerm = stateSearchTerm.toLowerCase();
    return allStates.filter(state => 
      state.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allStates, stateSearchTerm]);
  // -----------------------------


  // Memoize all cities of the selected state
  const allCities = useMemo(() => {
    return selectedState ? City.getCitiesOfState("IN", selectedState) : [];
  }, [selectedState]);

  // Filter cities based on city search term
  const filteredCities = useMemo(() => {
    const lowerCaseSearchTerm = citySearchTerm.toLowerCase();
    
    // If user has not typed anything, show all cities
    if (!lowerCaseSearchTerm) {
        return allCities;
    }

    // Filter by search term
    return allCities.filter(city => 
      city.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allCities, citySearchTerm]);


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

  // Updated function to handle State/City input click and filtering logic
  const handleLocationInputClick = () => {
    calculatePosition();

    if (!selectedState) {
      // Logic for State selection/filtering
      setCityInputPlaceholder("First select state");
      // Set the input value to the current state search term for display
      setCitySearchTerm(stateSearchTerm); 
      setShowStateDropdown(true);
      setShowCityDropdown(false);
    } else {
      // Logic for City selection/filtering
      setCityInputPlaceholder("Select City");
      // Set the input value to selected city or current search term
      setCitySearchTerm(selectedCity || citySearchTerm); 
      setShowCityDropdown(true);
      setShowStateDropdown(false);
    }
  };

  // New function to handle typing in the State/City input field
  const handleLocationInputChange = (e) => {
    const term = e.target.value;
    calculatePosition();

    if (!selectedState) {
      // User is typing to filter STATES
      setStateSearchTerm(term);
      setCitySearchTerm(term); // Keep City input value updated for display
      
      // Clear city states just in case
      setSelectedCity("");

      setShowStateDropdown(true);
      setShowCityDropdown(false);
    } else {
      // User is typing to filter CITIES
      setCitySearchTerm(term);
      setSelectedCity(""); // Clear selected city to show filtered list

      setShowCityDropdown(true);
      setShowStateDropdown(false);
    }
  }


  const handleStateSelect = (iso) => {
    setSelectedState(iso);
    setSelectedCity("");
    setStateSearchTerm(""); // Clear state search term
    setCitySearchTerm(""); // Clear city search term

    setShowStateDropdown(false);

    // After state selection, reset placeholder and open city dropdown
    setCityInputPlaceholder("Select City");
    calculatePosition();
    setTimeout(() => setShowCityDropdown(true), 100);
  };

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setCitySearchTerm(cityName); // Update search term to the selected name for display/re-opening
    setShowCityDropdown(false);
  };

  return (
    <>
      {/* TOP SEARCH CONTAINER (Fixed at the top) */}
      <div className={`search-container ${menuOpen ? "expanded" : ""}`}>
        <div className="top-bar-content">
          <div className="icon-circle"></div>

          <div className="profile-circle-expandable"></div>

          <div className="filter-box">
            <input
              type="text"
              className="filter-input"
              placeholder="Enter role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            <div className="city-wrapper">
              <input
                type="text"
                className="filter-input"
                placeholder={cityInputPlaceholder}
                // Input value will be the currently selected city OR the search term
                value={selectedCity || citySearchTerm} 
                // Handles typing for both State filtering (if no state selected) and City filtering
                onChange={handleLocationInputChange}
                // Handles click to open the correct dropdown
                onClick={handleLocationInputClick}
                ref={cityRef}
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

        {/* Expanded Menu Options */}
        {menuOpen && (
          <ul className="nav-options open">
            {topNavOptions.map((item) => (
              <li key={item.name}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* State dropdown - MOVED OUTSIDE search-container */}
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
            filteredStates.map((item) => ( // Use filteredStates here
              <li
                key={item.isoCode}
                className="dropdown-item"
                onClick={() => handleStateSelect(item.isoCode)}
              >
                {item.name}
              </li>
            ))
          ) : (
             <li className="dropdown-item" style={{ cursor: 'default', color: '#999' }}>
              No states found
            </li>
          )}
        </ul>
      )}

      {/* City dropdown - MOVED OUTSIDE search-container */}
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
            <li className="dropdown-item" style={{ cursor: 'default', color: '#999' }}>
              No cities found
            </li>
          )}
        </ul>
      )}

      {/* Bottom Navigation */}
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