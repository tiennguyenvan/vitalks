import React from 'react';
import '../App.css';
import logo from '../assets/images/vitalks-logo.png';
import userPhoto from '../assets/images/profile-user-photo-1.png';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";

const Header = () => {
    return ( <>
        <div className="navbar">
            <nav className="container">
                <div className="navbar__left">
                    <img className="navbar__logo" alt='Site Logo' src={logo} />
                    <div className="navbar__search-container">
                        <span className="navbar__search-icon"><FaMagnifyingGlass /></span>
                        <input type="text" placeholder="Type to Search" className="navbar__search-input" />
                    </div>
                </div>

                <div className="navbar__right">
                    <a href="/" className="navbar__link navbar__link--active">Home</a>
                    <a href="/community" className="navbar__link">Community</a>
                    <a href="/messaging" className="navbar__link">Messaging</a>
                    <a href="/notification" className="navbar__link">Notifications</a>

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
            </nav>
        </div>
    </> );
}
 
export default Header;