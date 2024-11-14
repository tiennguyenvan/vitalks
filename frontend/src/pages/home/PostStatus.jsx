import React, { useState, useEffect } from 'react';
import axios from 'axios';
import userPhoto from '../../assets/images/profile-user-photo-1.png';
import Env from '../../utils/Env';

const PostStatus = ({ refreshPosts }) => {
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const userEmail = localStorage.getItem("email");
	const userCode = localStorage.getItem("code");

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

	// Handle content change
	const handleContentChange = (e) => setContent(e.target.value);

	// Handle image change
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) setImage(file);
	};

	// Handle category selection
	const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

	// Handle form submission
	const handleSubmit = async () => {
		if (!content.trim() || !selectedCategory) {
			alert("Post content and category are required.");
			return;
		}

		// Prepare form data
		const formData = new FormData();
		formData.append("content", content);
		formData.append("categoryId", selectedCategory);
		formData.append("email", userEmail); // Add email to FormData
		formData.append("code", userCode); // Add code to FormData
		if (image) formData.append("image", image);

		try {
			await axios.post(`${Env.SERVER_URL}/posts`, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			// Clear inputs and refresh posts
			setContent("");
			setImage(null);
			setSelectedCategory("");
			refreshPosts(); // Callback to reload posts after submission
		} catch (error) {
			console.error("Error creating post:", error);
			alert("Failed to create post. Please try again.");
		}
	};

	return (
		<div className="feed__input">
			<img src={userPhoto} alt="User Avatar" className="feed__input-avatar" />
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

						{/* Image upload */}
						<input type="file" accept="image/*" onChange={handleImageChange} />
					</div>

					<button
						className="feed__input-button form__button form__button--primary"
						onClick={handleSubmit}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};

export default PostStatus;
