import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import Env from '../utils/Env';
import { formatDistanceToNow } from 'date-fns';
import { fetchCurrentUser, isUserLoggedIn, redirectToLogin, getCurrentUserEmailCode } from '../utils/Lib';
import userPhoto from '../assets/images/profile-user-photo-1.png';


const Comments = ({ post }) => {
	const [comments, setComments] = useState([]);
	const [isCommentBoxShowed, setIsCommentBoxShowed] = useState(false);
	const [isAllCommentsShowed, setIsAllCommentsShowed] = useState(false);
	const [newCommentContent, setNewCommentContent] = useState("");
	const [currentUser, setCurrentUser] = useState(null); // Store the current logged-in user
	
	const fetchComments = async (limit = 5) => {
		try {
			const response = await axios.get(
				`${Env.SERVER_URL}/comments/${post._id}?limit=${limit}`
			);
			return response.data;
		} catch (error) {
			console.error('Error fetching comments:', error);
			return [];
		}
	};	

	const loadComments = async (limit = 5) => {		
		const comments = await fetchComments(limit);
		const user = await fetchCurrentUser();
		if (!user) {
			redirectToLogin();
			return;
		}
		setCurrentUser(user);
		
		setComments(comments);

	};
	const showCommentBox = async () => {
		await loadComments();
		setIsCommentBoxShowed(true)
	};
	const showAllComments = async (post) => {
		await loadComments(post._id, 0);
		setIsAllCommentsShowed(true);
	};
	const onCommentFormChange = (value) => {
		setNewCommentContent(value);
	};
	const submitComment = async () => {

		if (!newCommentContent.trim()) {
			alert("Comment cannot be empty");
			return;
		}
		if (!isUserLoggedIn()) {
			redirectToLogin();
			return;
		}

		try {
			await axios.post(`${Env.SERVER_URL}/comments`, {
				parentId: post._id,
				parentType: "Post",
				content: newCommentContent,
				...getCurrentUserEmailCode()
			});

			// Clear input and reload comments
			onCommentFormChange(""); // Clear input
			await loadComments(); // Reload comments
		} catch (error) {
			console.error("Error submitting comment:", error);
			alert("Failed to submit comment.");
		}
	};

	const deleteComment = async (commentId) => {
		if (!isUserLoggedIn()) {
			redirectToLogin();
			return;
		}

		try {
			await axios.delete(`${Env.SERVER_URL}/comments/${commentId}`, {
				data: {...getCurrentUserEmailCode()}
			});
			await loadComments(); // Reload comments
		} catch (error) {
			console.error("Error deleting comment:", error);
			alert("Failed to delete comment.");
		}
	};


	return (
		<>
			<div className="post__reactions">
				<span
					className="post__reaction post__reaction__comment"
					onClick={showCommentBox}
				>
					{post.commentsCount || 0} Comments
				</span>
			</div>

			{isCommentBoxShowed && (
				<div className="comments__section">
					<hr className="comments__divider" />

					{/* View More Link if comments are more than 5 */}
					{!isAllCommentsShowed && post.commentsCount > comments.length && (
						<div className="view__more">
							<a href={`#${post._id}`} onClick={showAllComments} className="view__more-link">
								View more comments
							</a>
						</div>
					)}

					{comments.length > 0 && comments.map((comment) => {
						return (
							<div className="comment" key={comment._id}>
								<img
									src={comment.author.avatar? `${Env.SERVER_URL}/${comment.author.avatar}` : userPhoto}
									alt="User avatar"
									className="comment__avatar"
								/>
								<div className="comment__content">
									<span className="comment__username">{comment.author?.name || "Unknown User"}</span>
									<div className="comment__date">
										{comment.createdAt && <small>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</small>}
									</div>
									<p className="comment__text">{comment.content}</p>
									{currentUser && currentUser._id === comment.author._id && (
										<button
											className="comment__delete"
											onClick={() => deleteComment(comment._id)}
										>
											Delete
										</button>
									)}
								</div>
							</div>
						)
					})}
				</div>
			)}

			{isCommentBoxShowed && (
				<div className="post__comment-box">
					<textarea type="text" className="comment__input" placeholder="Write a comment..." value={newCommentContent} onChange={(e) => onCommentFormChange(e.target.value)} />
					<button className="comment__submit" onClick={submitComment}>Post</button>
				</div>
			)}
		</>
	);
}

export default Comments;