import React from 'react';
import { FaHeart, FaComment, FaShareNodes } from "react-icons/fa6";
import Env from '../../utils/Env';

const Posts = ({ posts }) => {
    return (
        <div>
            {posts.map((post, index) => (
                <div className="post" key={index} >
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
                            <img src={`${Env.SERVER_URL}${post.imageURL}`} alt="Post feature" className="post__image" />
                        )}
                    </div>
                    <div className="post__reactions">
                        <span className="post__reaction post__reaction__like"><FaHeart /> {post.likesCount || 0}</span>
                        <span className="post__reaction post__reaction__comment"><FaComment /> {post.commentsCount || 0}</span>
                        <span className="post__reaction post__reaction__share"><FaShareNodes /> Share</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Posts;
