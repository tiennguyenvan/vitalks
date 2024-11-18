import React, { useState, useEffect } from 'react';
import PostForm from './PostForm';
import Posts from './Posts';
import axios from 'axios';
import Env from '../utils/Env';

const Feed = () => {
    const [posts, setPosts] = useState([]);

    // Define refreshPosts to fetch posts from the backend
    const refreshPosts = async () => {
        try {
            const response = await axios.get(`${Env.SERVER_URL}/posts`);
            setPosts(response.data); // Update posts with data from backend
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Fetch posts on component mount
    useEffect(() => {
        refreshPosts();
    }, []);

    return (
        <div className="feed">
            {/* Pass refreshPosts as a prop to PostStatus */}
            <PostForm refreshPosts={refreshPosts} />

            {/* Posts */}
            {posts.length > 0 && <Posts posts={posts} setPosts={setPosts} />}
        </div>
    );
};

export default Feed;
