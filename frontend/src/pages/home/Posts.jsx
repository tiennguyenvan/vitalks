import React from 'react';
import { FaHeart } from "react-icons/fa6";
import { FaComment } from "react-icons/fa6";
import { FaShareNodes } from "react-icons/fa6";

const Posts = ({ posts, thumbnail }) => {
    return (
        <div>
            {posts.map((post, index) => (
                <div className="post" key={index} >
                    <div className="post__header">
                        <img src="https://via.placeholder.com/40" alt="User Photo" className="post__avatar" />
                        <div className="post__info">
                            <span className="post__username">John Doe</span>
                            <span className="post__time">2 hrs ago</span>
                        </div>
                        <button className="post__options">•••</button>
                    </div>
                    <div className="post__content">
                        <p className="post__text">Lorem ipsum dolor sit amet consectetur. Aliquam vel proin vitae lacus.</p>
                        <img src="https://picsum.photos/600/400" alt="Image" className="post__image" />
                    </div>
                    <div className="post__reactions">
                        <span className="post__reaction post__reaction__like--active"><FaHeart /> 24k</span>
                        <span className="post__reaction post__reaction__comment--active"><FaComment /> 500</span>
                        <span className="post__reaction post__reaction__share--active"><FaShareNodes /> 48</span>
                    </div>
                </div>
            ))}
        </div>
        
    );
}

export default Posts;
