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

  const [searchTerm, setSearchTerm] = useState("");
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

  // 🔥 FIX: NO RESET ON CLICK
  const handleLocationInputClick = () => {
    calculatePosition();

    if (!selectedState) {
      setShowStateDropdown(true);
      setShowCityDropdown(false);
    } else {
      setShowCityDropdown(true);
      setShowStateDropdown(false);
    }
  };

  // 🔥 FIX: This does NOT reset fields anymore
  const handleLocationInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Clear city ONLY when typing new search
    if (selectedCity) setSelectedCity("");

    calculatePosition();

    if (!selectedState) {
      setShowStateDropdown(true);
      setShowCityDropdown(false);
    } else {
      setShowCityDropdown(true);
      setShowStateDropdown(false);
    }
  };

  const handleStateSelect = (iso, stateName) => {
    setSelectedState(iso);
    setSelectedCity("");
    setSearchTerm("");
    setShowStateDropdown(false);
    setLocationPlaceholder(`Select City in ${stateName}`);

    calculatePosition();
    setTimeout(() => setShowCityDropdown(true), 120);
  };

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setSearchTerm(cityName);
    setShowCityDropdown(false);
    setLocationPlaceholder("Select City");
  };

  // Text shown inside input
  const inputText = selectedCity ? selectedCity : searchTerm;

  // Text used to calculate auto input width
  const mirrorText = selectedCity
    ? selectedCity
    : searchTerm || locationPlaceholder;

  return (
    <>
      {/* TOP SEARCH CONTAINER */}
      <div className={`search-container ${menuOpen ? "expanded" : ""}`}>
        <div className="top-bar-content">
          <div className="icon-circle"></div>
          <div className="profile-circle-expandable"></div>

          <div className="filter-box">

            {/* ROLE INPUT - FIXED */}
            <div className="input-wrapper">
              <span className="input-mirror">{role || "Enter role"}</span>

              <input
                type="text"
                className="filter-input"
                style={{
                  width: `${(role || "Enter role").length + 1}ch`,
                }}
                placeholder="Enter role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onClick={(e) => e.stopPropagation()} // FIX
              />
            </div>

            {/* CITY/STATE INPUT - FIXED */}
            <div className="input-wrapper" ref={cityRef}>
              <span className="input-mirror">{mirrorText}</span>

              <input
                type="text"
                className="filter-input"
                style={{
                  width: `${mirrorText.length + 1}ch`,
                }}
                placeholder={locationPlaceholder}
                value={inputText}
                onChange={handleLocationInputChange}
                onClick={handleLocationInputClick} // FIX (does NOT reset)
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
            <li className="dropdown-item" style={{ color: "#999" }}>
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
            <li className="dropdown-item" style={{ color: "#999" }}>
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
