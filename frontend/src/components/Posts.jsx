import React, { useState, useEffect } from 'react';
import userPhoto from '../assets/images/profile-user-photo-1.png';
// import { FaHeart, FaComment, FaShareNodes } from "react-icons/fa6";
import Env from '../utils/Env';
import Comments from './Comments';
import { fetchCurrentUser, getCurrentUserEmailCode, isUserLoggedIn, redirectToLogin } from '../utils/Lib';
import axios from 'axios';
import PostForm from './PostForm';

const Posts = ({ posts, setPosts }) => {
	const [dropdownVisibleIndex, setDropdownVisibleIndex] = useState(null);
	const [editingPostId, setEditingPostId] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);

	const toggleDropdown = (index) => {
		setDropdownVisibleIndex(prevIndex => (prevIndex === index ? null : index));
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const fetchUser = async () => {
			const user = await fetchCurrentUser();
			if (user) {
				setCurrentUser(user);
			} else {
				redirectToLogin();
			}
		};

		const handleClickOutside = (event) => {
			// Close the dropdown if click happens outside dropdown button or menu
			if (!event.target.closest('.post__options') && !event.target.closest('.dropdown__menu')) {
				setDropdownVisibleIndex(null);
			}
		};
		fetchUser();
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);
	if (!isUserLoggedIn()) {
		redirectToLogin();
		return null;
	}

	if (!currentUser) {
		return <div>Loading...</div>;
	}


	const refreshPosts = async () => {
		try {
			const response = await axios.get(`${Env.SERVER_URL}/posts`);
			setPosts(response.data);
		} catch (error) {
			console.error("Error refreshing posts:", error);
		}
	};

	const deletePost = async (postId) => {
		if (!isUserLoggedIn()) {
			redirectToLogin();
			return;
		}

		const confirmDelete = window.confirm("Are you sure you want to delete this post?");

		if (!confirmDelete) return;

		try {
			await axios.delete(`${Env.SERVER_URL}/posts/${postId}`, {
				data: { ...getCurrentUserEmailCode() }, // Pass email and code for authentication
			});

			// Update the posts state after deletion
			setPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
			alert("Post deleted successfully.");
		} catch (error) {
			console.error("Error deleting post:", error);
			alert("Failed to delete post.");
		}
	};

	return (
		<div>
			{posts.map((post, index) => {
				const isCurrentUser = currentUser._id === post.author?._id;
				// if true, all comments will be shown. Otherwise, only 5 comments will be shown								
				return (
					<div className="post" key={index} id={`post_${index}`}>
						<div className="post__header">
							<img
								src={post.author.avatar ? `${Env.SERVER_URL}/${post.author.avatar}` : userPhoto}
								alt="User avatar"
								className="post__avatar"
							/>
							<div className="post__info">
								<span className="post__username">{post.author?.name || "Private User"}</span>
								<span className="post__time">{new Date(post.createdAt).toLocaleString()}</span>
							</div>
							{isCurrentUser &&
								<button
									className="post__options"
									onClick={(e) => {
										toggleDropdown(index);
									}}
								>
									•••
								</button>
							}

							{dropdownVisibleIndex === index && (
								<div className="post__options-dropdown">
									<button className="post__options-dropdown__item" onClick={() => setEditingPostId(post._id)}>Edit</button>
									<button className="post__options-dropdown__item" onClick={() => deletePost(post._id)}
									>Delete</button>
								</div>
							)}
						</div>
						{isCurrentUser && editingPostId === post._id ? (
							<PostForm
								post={post}
								refreshPosts={refreshPosts}
								onSubmit={() => setEditingPostId(null)} // Exit edit mode after submission
							/>
						) : (
							<div className="post__content">
								<p className="post__text">{post.content}</p>
								{post.imageURL && (
									<img
										src={`${Env.SERVER_URL}${post.imageURL}`}
										alt="Post feature"
										className="post__image"
									/>
								)}
							</div>
						)}
						<Comments post={post} />
					</div>
				);
			})}
		</div>
	);
}

export default Posts;