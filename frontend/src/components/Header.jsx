import React, { useState } from 'react';
import '../App.css';
import userPhoto from '../assets/images/profile-user-photo-1.png';
import { FaBars, FaHouse, FaCircleUser, FaMagnifyingGlass, FaAngleDown } from "react-icons/fa6";
import SiteLogo from './SiteLogo';

const Header = () => {
	const [inSearch, setSearchValue] = useState('');
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const currentUser = JSON.parse(localStorage.getItem('user'));
	
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
								<a href={`/profile/${(currentUser && currentUser._id) ? currentUser._id: ''}`} className="navbar__link">
									<span className="nav__icon"><FaCircleUser /></span>
									<span className="nav__label">Profile</span>
								</a>
								<div className="navbar__profile">
									<div className="navbar__profile-info">
										<span className="navbar__profile-chevron"><FaAngleDown /></span>
										<span className="navbar__profile-name">Hello, John</span>
										<img src={userPhoto} alt="Profile" className="navbar__profile-image" />
									</div>
									<div className="navbar__submenu">
										<a onClick={(e) => {
											e.preventDefault();
											localStorage.removeItem('email');
											localStorage.removeItem('code');
											window.location.href = '/login';
										}} href="/login" className="navbar__submenu-item">Logout</a>
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
