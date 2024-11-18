import React, { useState, useEffect } from 'react';

// import { FaHeart, FaComment, FaShareNodes } from "react-icons/fa6";
import Env from '../utils/Env';
import Comments from './Comments';
import { getCurrentUserEmailCode, isUserLoggedIn, redirectToLogin } from '../utils/Lib';
import axios from 'axios';

const Posts = ({ posts, setPosts }) => {
	const [dropdownVisibleIndex, setDropdownVisibleIndex] = useState(null);

	const toggleDropdown = (index) => {
		setDropdownVisibleIndex(prevIndex => (prevIndex === index ? null : index));
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			// Close the dropdown if click happens outside dropdown button or menu
			if (!event.target.closest('.post__options') && !event.target.closest('.dropdown__menu')) {
				setDropdownVisibleIndex(null);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	// Delete post function
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
				// if true, all comments will be shown. Otherwise, only 5 comments will be shown								
				return (
					<div className="post" key={index} id={`post_${index}`}>
						<div className="post__header">
							<img
								src={post.author?.profilePicture || "https://via.placeholder.com/40"}
								alt="User avatar"
								className="post__avatar"
							/>
							<div className="post__info">
								<span className="post__username">{post.author?.name || "Unknown User"}</span>
								<span className="post__time">{new Date(post.createdAt).toLocaleString()}</span>
							</div>
							<button
								className="post__options"
								onClick={(e) => {
									toggleDropdown(index);
								}}
							>
								•••
							</button>

							{/* Dropdown menu */}
							{dropdownVisibleIndex === index && (
								<div className="post__options-dropdown">
									<button className="post__options-dropdown__item">Edit</button>
									<button className="post__options-dropdown__item" onClick={() => deletePost(post._id)}
									>Delete</button>
								</div>
							)}
						</div>
						<div className="post__content">
							<p className="post__text">{post.content}</p>
							{post.imageURL && (
								<img src={`${Env.SERVER_URL}${post.imageURL}`} alt="Post feature" className="post__image" />
							)}
						</div>
						<Comments post={post} />
					</div>
				);
			})}
		</div>
	);
}

export default Posts;