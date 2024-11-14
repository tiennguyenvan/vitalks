import React, { useState } from 'react';
import { FaHeart, FaComment, FaShareNodes } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';

const Posts = ({ posts }) => {
    const [visibleCommentBoxes, setVisibleCommentBoxes] = useState(
        posts.map(() => false)
    );

    const [expandedComments, setExpandedComments] = useState(
        posts.map(() => false)
    );

    const toggleCommentBox = (index) => {
        setVisibleCommentBoxes(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const toggleExpandComments = (index) => {
        setExpandedComments(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    // Retrieve comments from the database
    const dummyComments = [
        { 
            id: 1, 
            author: { name: "Alice Johnson", profilePicture: "https://via.placeholder.com/40" }, 
            text: "Awesome, totally relatable!", 
            date: "2024-11-01T08:14:25" 
        },
        { 
            id: 2, 
            author: { name: "John Smith", profilePicture: "https://via.placeholder.com/40" }, 
            text: "Great post! I totally agree with you.", 
            date: "2024-11-02T10:24:35" 
        },
        { 
            id: 3, 
            author: { name: "Jane Doe", profilePicture: "https://via.placeholder.com/40" }, 
            text: "This is a dummy comment. Love this post!", 
            date: "2024-11-03T12:34:56" 
        },
        { 
            id: 4, 
            author: { name: "Bob Williams", profilePicture: "https://via.placeholder.com/40" }, 
            text: "I disagree, but interesting take!", 
            date: "2024-11-04T09:15:30" 
        },
        { 
            id: 5, 
            author: { name: "Charlie Brown", profilePicture: "https://via.placeholder.com/40" }, 
            text: "Really insightful! Keep it up.", 
            date: "2024-11-05T11:45:50" 
        },
        { 
            id: 6, 
            author: { name: "Lucy Green", profilePicture: "https://via.placeholder.com/40" }, 
            text: "Amazing post, thanks for sharing!", 
            date: "2024-11-06T14:33:00" 
        },
        { 
            id: 7, 
            author: { name: "David Wilson", profilePicture: "https://via.placeholder.com/40" }, 
            text: "Could you elaborate on this? Very interesting!", 
            date: "2024-11-07T16:10:45" 
        },
        { 
            id: 8, 
            author: { name: "Olivia Taylor", profilePicture: "https://via.placeholder.com/40" }, 
            text: "This is very helpful! Thank you!", 
            date: "2024-11-12T17:29:00" 
        },
        { 
            id: 9, 
            author: { name: "Emma Miller", profilePicture: "https://via.placeholder.com/40" }, 
            text: "I love this! So relevant and informative.", 
            date: "2024-11-13T18:52:10" 
        },
        { 
            id: 10, 
            author: { name: "Lucas Davis", profilePicture: "https://via.placeholder.com/40" }, 
            text: "Very well explained. Thanks for this post!", 
            date: "2024-11-13T22:30:25" 
        },
    ];
    

    return (
        <div>
            {posts.map((post, index) => {
                const comments = dummyComments;

                // if true, all comments will be shown. Otherwise, only 5 comments will be shown
                const displayedComments = expandedComments[index] 
                    ? comments 
                    : comments.slice(-5);

                return (
                    <div className="post" key={index}>
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
                            <button className="post__options">•••</button>
                        </div>
                        <div className="post__content">
                            <p className="post__text">{post.content}</p>
                            {post.imageURL && (
                                <img src={post.imageURL} alt="Post feature" className="post__image" />
                            )}
                        </div>
                        <div className="post__reactions">
                            <span className="post__reaction post__reaction__like"><FaHeart /> {post.likesCount || 0}</span>
                            <span 
                                className="post__reaction post__reaction__comment" 
                                onClick={() => toggleCommentBox(index)} 
                            >
                                <FaComment /> {post.commentsCount || 0}
                            </span>
                            <span className="post__reaction post__reaction__share"><FaShareNodes /> Share</span>
                        </div>

                        {/* Comments */}
                        {visibleCommentBoxes[index] && (
                            <div className="comments__section">
                                <hr className="comments__divider" />

                                {/* View More Link if comments are more than 5 */}
                                {comments.length > 5 && !expandedComments[index] && (
                                    <div className="view__more">
                                        <a href="#" onClick={() => toggleExpandComments(index)} className="view__more-link">
                                            View more comments
                                        </a>
                                    </div>
                                )}

                                {displayedComments.map((comment) => (
                                    <div className="comment" key={comment.id}>
                                        <img 
                                            src={comment.author?.profilePicture || "https://via.placeholder.com/40"} 
                                            alt="User avatar" 
                                            className="comment__avatar" 
                                        />
                                        <div className="comment__content">
                                            <span className="comment__username">{comment.author?.name || "Unknown User"}</span>
                                            <div className="comment__date">
                                                {/* Formatting the posted date to current date */}
                                                <small>{formatDistanceToNow(new Date(comment.date), { addSuffix: true })}</small>
                                            </div>
                                            <p className="comment__text">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Input field and button for posting a comment */}
                        {visibleCommentBoxes[index] && (
                            <div className="post__comment-box">
                                <textarea type="text" className="comment__input" placeholder="Write a comment..." />
                                <button className="comment__submit">Post</button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Posts;
