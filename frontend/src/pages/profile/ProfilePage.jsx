import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import defaultUserCoverImage from "../../assets/images/profile-user-background.png";
import "./ProfilePage.scss";
import defaultUserAvatar from "../../assets/images/profile-user-photo-1.png";
import Feed from "../../components/Feed";
import Env from "../../utils/Env";
import { fetchCurrentUser, getCurrentUserEmailCode, isUserLoggedIn, redirectToLogin } from "../../utils/Lib";
import { IoIosCamera } from "react-icons/io";


const ProfilePage = () => {
	const { id: profileUserId } = useParams();
	const [isFollowing, setIsFollowing] = useState(false);
	const [profileUserInfo, setProfileUserInfo] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const [editingField, setEditingField] = useState(null); // Track which field is being edited
	const [editedValue, setEditedValue] = useState(""); // Store the edited value
	const [isFetching, setIsFetching] = useState(false);

	// Fetch the current user and profile data
	useEffect(() => {
		if (isFetching) {
			return;
		}
		setIsFetching(true);
		const fetchData = async () => {
			if (!isUserLoggedIn()) {
				redirectToLogin();
				return;
			}

			try {
				const user = await fetchCurrentUser();
				if (user) {
					setCurrentUser(user);
				} else {
					redirectToLogin();
				}

				const { email, code } = getCurrentUserEmailCode();

				// Fetch profile user data
				const profileResponse = await axios.post(`${Env.SERVER_URL}/users/get-user/${profileUserId}`, { email, code });
				console.log(profileResponse);
				setProfileUserInfo({
					name: profileResponse.data.name || "Anonymous User",
					avatar: profileResponse.data.avatar ? `${Env.SERVER_URL}/${profileResponse.data.avatar}` : defaultUserAvatar,
					cover: profileResponse.data.cover ? `${Env.SERVER_URL}/${profileResponse.data.cover}` : defaultUserCoverImage,
					thoughtsCount: profileResponse.data.thoughtsCount || 0,
					listenersCount: profileResponse.data.listenersCount || 0,
					followingsCount: profileResponse.data.followingsCount || 0,
				});

				// Check follow status
				const followStatusResponse = await axios.post(`${Env.SERVER_URL}/users/is-following/${profileUserId}`, { email, code });
				setIsFollowing(followStatusResponse.data.following);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [profileUserId, profileUserInfo, isFetching]);

	// Follow/Unfollow handler
	const handleFollowToggle = async () => {
		try {
			const { email, code } = getCurrentUserEmailCode();

			if (isFollowing) {
				await axios.post(`${Env.SERVER_URL}/users/unfollow`, { email, code, followedId: profileUserId });
				setProfileUserInfo((prev) => ({
					...prev,
					listenersCount: prev.listenersCount - 1,
				}));
			} else {
				await axios.post(`${Env.SERVER_URL}/users/follow`, { email, code, followedId: profileUserId });
				setProfileUserInfo((prev) => ({
					...prev,
					listenersCount: prev.listenersCount + 1,
				}));
			}

			setIsFollowing(!isFollowing);
		} catch (error) {
			console.error("Error updating follow status:", error);
		}
	};

	const handleEditClick = (field) => {
		setEditingField(field);
		setEditedValue(profileUserInfo[field]);
	};

	const updateProfile = (field, value) => {
		if (field === 'avatar' || field === 'cover') {
			value = value.target.files[0]; // File upload
		}

		if (value) {
			const formData = new FormData();
			const { email, code } = getCurrentUserEmailCode();
			formData.append('field', field); // Field to update
			formData.append('value', value); // New value (file or text)
			formData.append('email', email);
			formData.append('code', code);

			axios
				.patch(`${Env.SERVER_URL}/users/update`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
						"X-User-Email": email,
						"X-User-Code": code
					}
				})
				.then((response) => {
					const updatedValue = field === 'avatar' || field === 'cover'
						? URL.createObjectURL(value) // Update image preview
						: response.data[field]; // Use backend response for text updates

					setProfileUserInfo((prev) => ({
						...prev,
						[field]: updatedValue, // Update UI dynamically
					}));
					alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
				})
				.catch((error) => {
					console.error(`Error updating ${field}:`, error);
					if (error.message.includes("401")) {
						alert("Session expired. Please login again.");
						redirectToLogin();
						return;
					}
					alert(`Failed to update ${field}.`);
				});
		}
	};



	if (!currentUser || !profileUserInfo) {
		return <div>Loading...</div>;
	}
	const isProfileOwner = currentUser._id === profileUserId;
	return (
		<div className="page page-profile">
			<Header />
			<div className="container">
				<div className="main">
					<div className="profile profile__cover-container">
						<img
							className="profile__cover-photo"
							id="profileStarBG"
							src={profileUserInfo.cover}
							alt="User Cover"
						/>
						{isProfileOwner &&
							<>
								<button className="btn-edit-cover" onClick={() => isProfileOwner && document.getElementById("coverImageUpload").click()}>
									<IoIosCamera /> Edit Cover Photo
								</button>
								<input
									id="coverImageUpload"
									type="file"
									style={{ display: "none" }} // Hide the input element
									accept="image/*"
									onChange={(e) => updateProfile("cover", e)}
								/>
							</>
						}
						<div className="row">
							<div className="profile__info">
								<div className="profile__photo-container">
									<img
										className="profile__photo"
										src={profileUserInfo.avatar}
										alt="Avatar"
										style={{ height: 100, width: 100 }}
									/>
									{isProfileOwner &&
										<>
											<button onClick={() => isProfileOwner && document.getElementById("avatarImageUpload").click()}>
												<IoIosCamera />
											</button>
											<input
												id="avatarImageUpload"
												type="file"
												style={{ display: "none" }} // Hide the input element
												accept="image/*"
												onChange={(e) => updateProfile("avatar", e)}
											/>
										</>
									}
								</div>

								<div className="info">
									<div className="info__main">


										<h2 className="info__name">
											{editingField === "name" ? (
												<>
													<input
														type="text"
														value={editedValue}
														onChange={(e) => setEditedValue(e.target.value)}
													/>
													<button onClick={()=> setEditingField(null)}>x</button>
													<button onClick={()=>{
														updateProfile("name", editedValue);
                                                        setEditingField(null);
                                                        setEditedValue(null);
													}}>V</button>
												</>
											) :
												<>
													{profileUserInfo.name}
													{isProfileOwner &&
														<button onClick={() => isProfileOwner && handleEditClick("name")}>Edit</button>
													}
												</>
											}
										</h2>

										{isProfileOwner && (
											<div className="info_buttons">
												<button
													className="btn form__button form__button--follow"
													onClick={handleFollowToggle}
												>
													{isFollowing ? "Unfollow" : "Follow"}
												</button>
											</div>
										)}
									</div>
									<div className="items">
										<div className="item">
											<strong>{profileUserInfo.thoughtsCount}</strong>
											<div>Thoughts</div>
										</div>
										<div className="item">
											<strong>{profileUserInfo.listenersCount}</strong>
											<div>Listeners</div>
										</div>
										<div className="item">
											<strong>{profileUserInfo.followingsCount}</strong>
											<div>Following</div>
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

									<p>
										{editingField === "bio" ? (
											<>
												<textarea
													className="info__bio"
													value={
														editedValue
													}
													onChange={(e) => setEditedValue(e.target.value)}
												/>
												<button onClick={()=> setEditingField(null)}>x</button>
													<button onClick={()=>{
														updateProfile("bio", editedValue);
                                                        setEditingField(null);
                                                        setEditedValue(null);
													}}>V</button>
											</>
										) : <>
											{profileUserInfo.bio}
											{isProfileOwner &&
												<button onClick={() => isProfileOwner && handleEditClick("bio")}>Edit</button>
											}
										</>}
									</p>
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
