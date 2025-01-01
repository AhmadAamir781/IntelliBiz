import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from"../Register/Register.module.css"

function Header({ searchTerm, setSearchTerm }) {
  return (
    <header>
      <div className="header-content">
        <div className="logo">BusinessProfiles</div>
        <div className={styles['nav-links']}>   
                        <a href="/login">Login/Signup</a>
                        <a href="/register">Register</a>
                        <a href="/home">Home</a>
                    </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>
    </header>
  );
}

export default Header;