import React, { useState } from 'react';
import PostStatus from './PostStatus';
import Posts from './Posts'

const Feed = () => {
    const [posts, setPosts] = useState(new Array(5).fill(null)); // fetch posts from the backend

    return ( <>
        <div className="feed">
            {/* Post status */}
            <PostStatus />

            {/* Posts */}
            <Posts posts={posts}/>
        </div>

    </> );
}
 
export default Feed;