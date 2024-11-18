import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import profileBG from "../../assets/images/profile-user-background.png";
import "./ProfilePage.scss";
import profileUser from "../../assets/images/profile-user-photo-1.png";
import Feed from "../../components/Feed";
import Env from "../../utils/Env";

const ProfilePage = () => {
	const { id: profileUserId } = useParams();
	const [isFollowing, setIsFollowing] = useState(false);
	const [profileUserInfo, setProfileUserInfo] = useState({});
	const currentUser = JSON.parse(localStorage.getItem('user'));


	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				const currentUserEmail = localStorage.getItem("email");
				const currentUserCode = localStorage.getItem("code");

				// Check if email and code are present
				if (!currentUserEmail || !currentUserCode) {
					console.error("User email or code is missing. Please log in again.");
					return;
				}

				// Fetch profile details using the updated POST method
				const response = await axios.post(Env.SERVER_URL + "/users/get-user/" + profileUserId, {
					email: currentUserEmail,
					code: currentUserCode,
				});

				setProfileUserInfo({
					thoughtsCount: response.data.thoughtsCount || 0,
					listenersCount: response.data.listenersCount || 0,
					followingsCount: response.data.followingsCount || 0,
				});

				// Check if the current user is already following the profile user
				const followStatus = await axios.post(Env.SERVER_URL + "/users/is-following/" + profileUserId, {
					email: currentUserEmail,
					code: currentUserCode,
				});

				setIsFollowing(followStatus.data.following);
			} catch (error) {
				console.error("Error fetching profile data:", error);
			}
		};

		fetchUserInfo();
	}, [profileUserId]);
	
	// Handle follow/unfollow actions
	const handleFollowToggle = async () => {
		try {
			const userEmail = localStorage.getItem("email");
			const userCode = localStorage.getItem("code");

			if (!userEmail || !userCode) {
				console.error("User email or code is missing. Please log in again.");
				return;
			}

			if (isFollowing) {
				// Unfollow action
				await axios.post(Env.SERVER_URL + "/users/unfollow", {
					email: userEmail,
					code: userCode,
					followedId: profileUserId,
				});
				setProfileUserInfo((prevState) => ({
					...prevState,
					listenersCount: prevState.listenersCount - 1,
				}));
			} else {
				// Follow action
				await axios.post(Env.SERVER_URL + "/users/follow", {
					email: userEmail,
					code: userCode,
					followedId: profileUserId,
				});
				setProfileUserInfo((prevState) => ({
					...prevState,
					listenersCount: prevState.listenersCount + 1,
				}));
			}
			setIsFollowing(!isFollowing);
		} catch (error) {
			console.error("Error updating follow status:", error);
		}
	};

	return (
		<div className="page page-profile">
			<Header />
			<div className="container">
				<div className="main">
					<div className="profile profile__cover-container">
						<img 
							className="profile__cover-photo"
							id="profileStarBG" 
							src={profileBG} 
							alt="User Cover" />

						<div className="row">
							<div className="profile__info">
								<div className="profile__photo-container">
									<img
										className="profile__photo"
										src={profileUser}
										alt="Avatar"
										style={{ height: 100, width: 100 }}
									/>
								</div>

								<div className="info">
									<div className="info__main">
										<h2 className="info__name">John Doe</h2>
										{currentUser && currentUser._id && currentUser._id !== profileUserId && <>
											<div className="info_buttons">
												<button className="btn form__button form__button--follow" onClick={handleFollowToggle}>
													{isFollowing ? "Unfollow" : "Follow"}
												</button>
											</div>
										</>}
									</div>
									<div className="items">
										<div className="item">
											<strong>{profileUserInfo.thoughtsCount}</strong><div>Thoughts</div>
										</div>
										<div className="item">
											<strong>{profileUserInfo.listenersCount}</strong><div>Listeners</div>
										</div>
										<div className="item">
											<strong>{profileUserInfo.followingsCount}</strong><div>Following</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					
					</div>
					
					<div className="row">
						<div className="row__sidebar col-md-4 col-sm-12">
						<aside className="sidebar">
							<div className="sidebar__head">
								<h3 className="sidebar__title">About</h3>
							</div>
						</aside>
						</div>
						<div className="row__feed col-md-8 col-sm-12">
							<Feed />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
