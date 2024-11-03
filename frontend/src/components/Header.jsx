import React, { useState } from 'react';
import '../App.css';
import userPhoto from '../assets/images/profile-user-photo-1.png';
import { FaBars, FaHouse, FaPeopleGroup, FaMessage, FaBell, FaMagnifyingGlass, FaAngleDown } from "react-icons/fa6";
import SiteLogo from './SiteLogo';

const Header = () => {
    const [inSearch, setSearchValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevents page refresh
        console.log('Input Value:', inSearch); // Logs the input value to console
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return ( 
        <>
            <div className="navbar">
                <nav className="container">
                    <div className="navbar__left">
                        <SiteLogo />
                        <form className="navbar__search-container" onSubmit={handleSubmit}>
                            <span className="navbar__search-icon"><FaMagnifyingGlass /></span>
                            <input 
                                type="text" 
                                placeholder="Type to Search" 
                                className="navbar__search-input" 
                                value={inSearch} 
                                onChange={handleSearchChange} 
                            />
                        </form>
                    </div>

                    <div className="navbar__right">
                        <span className="hamburger" onClick={toggleMenu}><FaBars /></span>

                        <div className={`navbar__links ${isMenuOpen ? 'active' : ''}`}>
                            <div className="navbar__link__container">
                                <a href="/" className="navbar__link navbar__link--active">
                                    <span className="nav__icon"><FaHouse /></span>
                                    <span className="nav__label">Home</span>
                                </a>
                                <a href="/community" className="navbar__link">
                                    <span className="nav__icon"><FaPeopleGroup /></span>
                                    <span className="nav__label">Community</span>
                                </a>
                                <a href="/messaging" className="navbar__link">
                                    <span className="nav__icon"><FaMessage /></span>
                                    <span className="nav__label">Messaging</span>
                                </a>
                                <a href="/notification" className="navbar__link">
                                    <span className="nav__icon"><FaBell /></span>
                                    <span className="nav__label">Notifications</span>
                                </a>
                                <div className="navbar__profile">
                                    <div className="navbar__profile-info">
                                        <span className="navbar__profile-chevron"><FaAngleDown /></span>
                                        <span className="navbar__profile-name">Hello, John</span>
                                        <img src={userPhoto} alt="Profile" className="navbar__profile-image" />
                                    </div>
                                    <div className="navbar__submenu">
                                        <a href="/profile" className="navbar__submenu-item">Profile</a>
                                        <a href="/login" className="navbar__submenu-item">Logout</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}

export default Header;
