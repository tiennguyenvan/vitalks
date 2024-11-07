import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import profileBG from "../../assets/images/profile-user-background.png";
import "./ProfilePage.scss";
import profileUser from "../../assets/images/profile-user-photo-1.png";
import SideBarItem from "../home/SideBarItem";
import Feed from "../home/Feed";
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
					<div className="star">
						<img id="profileStarBG" src={profileBG} alt="Background" />

						<div className="starinfo">
							<div className="avatar">
								<img
									src={profileUser}
									alt="Avatar"
									style={{ height: 100, width: 100 }}
								/>
							</div>

							<div className="details">
								<h2 id="userName">John Doe</h2>
								<div className="star_stats">
									<div className="star_stat">
										<strong>{profileUserInfo.thoughtsCount}</strong> Thoughts
									</div>
									<div className="star_stat">
										<strong>{profileUserInfo.listenersCount}</strong> Listeners
										{currentUser && currentUser._id && currentUser._id !== profileUserId && <>
											<button className="btn follow-btn" onClick={handleFollowToggle}>
												{isFollowing ? "Unfollow" : "Follow"}
											</button>
										</>}

									</div>
									<div className="star_stat">
										<strong>{profileUserInfo.followingsCount}</strong> Following
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="star_gap">
						<br />
						<br />
						<br />
						<br />
					</div>

					<div className="row">
						<div className="row__sidebar col-md-4 col-sm-12">
							<SideBarItem title={"About"} url={"/"} />
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
