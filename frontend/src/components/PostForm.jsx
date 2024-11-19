import React, { useState, useEffect } from 'react';
import axios from 'axios';
import userPhoto from '../assets/images/profile-user-photo-1.png';
import Env from '../utils/Env';
import { getCurrentUserEmailCode, isUserLoggedIn, redirectToLogin } from '../utils/Lib';

const PostForm = ({ refreshPosts, post = null, onSubmit }) => {
	const [content, setContent] = useState(post?.content || "");
	const [image, setImage] = useState(post?.imageURL || null);
	const [imagePreview, setImagePreview] = useState(
		post?.imageURL ? `${Env.SERVER_URL}${post.imageURL}` : null
	);
	const [oldPostImage, setOldPostImage] = useState(post?.imageURL || null);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(post?.categoryId?._id || "");


	if (post) { console.log({ post, image }) }
	// Fetch categories on load
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get(`${Env.SERVER_URL}/categories`);
				setCategories(response.data);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};
		fetchCategories();
	}, []);

	if (!isUserLoggedIn()) {
		redirectToLogin();
		return null;
	}
	const { email, code } = getCurrentUserEmailCode();

	const handleContentChange = (e) => setContent(e.target.value);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(file)
			setImagePreview(URL.createObjectURL(file));
		};

	};
	const removeImage = () => {
		setImagePreview(null);
		setImage(null);
		setOldPostImage(null);
	};

	const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

	const handleSubmit = async () => {
		if (!content.trim() || !selectedCategory) {
			alert("Post content and category are required.");
			return;
		}

		const formData = new FormData();
		formData.append("content", content);
		formData.append("categoryId", selectedCategory);
		formData.append("email", email);
		formData.append("code", code);
		if (image) formData.append("image", image);
		if (oldPostImage) formData.append("oldPostImage", image);

		try {
			if (post) {
				// Editing an existing post ?email=${email}&code=${code}
				await axios.patch(`${Env.SERVER_URL}/posts/${post._id}`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
						"X-User-Email": email,
						"X-User-Code": code
					}
				});
				alert("Post updated successfully.");
				onSubmit(); // Call the callback to refresh the posts and exit edit mode
			} else {
				// Creating a new post
				await axios.post(`${Env.SERVER_URL}/posts`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
						"X-User-Email": email,
						"X-User-Code": code
					}
				});
				// Clear inputs and refresh posts
			}
			refreshPosts(); // Callback to reload posts after submission
			setContent("");
			setImage(null);
			setImagePreview(null);
			setSelectedCategory("");

		} catch (error) {
			console.error("Error submitting post:", error);
			alert("Failed to submit post. Please try again.");
		}
	};

	return (
		<div className="feed__input">
			{post === null && <img src={userPhoto} alt="User Avatar" className="feed__input-avatar" />}
			<div className="feed__input-content">
				<textarea
					className="feed__input-box"
					placeholder="Express yourself, we’re here to listen."
					rows="3"
					value={content}
					onChange={handleContentChange}
				></textarea>
				<div className="feed__input-options" style={{ flexWrap: "wrap" }}>
					{/* Category select */}
					<div>
						<select
							value={selectedCategory}
							onChange={handleCategoryChange}
							className="feed__input-category"
							required
						>
							<option value="">Select a category</option>
							{categories.map(category => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</select>

						{imagePreview ?
							<div className="feed__image-preview">
								<img src={imagePreview} alt="Uploaded" className="feed__image-thumbnail" />
								<button onClick={removeImage} className="feed__image-remove">x</button>
							</div>
							:
							<input
								type="file"
								className="feed__input-file"
								accept="image/*"
								onChange={handleImageChange}
							/>
						}
					</div>

					{post && (
						<button
							className="feed__input-button form__button form__button--secondary"
							onClick={onSubmit}
						>
							Cancel
						</button>
					)}

					<button
						className="feed__input-button form__button form__button--primary"
						onClick={handleSubmit}
					>
						{post ? "Update Post" : "Submit"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PostForm;
