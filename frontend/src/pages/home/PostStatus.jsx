import React, { useState } from 'react';
import userPhoto from '../../assets/images/profile-user-photo-1.png';

const PostStatus = () => {
    const options = [
        { value: 'public', label: 'Public'},
        { value: 'friends', label: 'Friends'},
        { value: 'private', label: 'Private'},
    ];

    return ( <>
        <div className="feed__input">
            <img src={userPhoto} alt="User Avatar" className="feed__input-avatar" />
            <div className="feed__input-content">
                <textarea className="feed__input-box" placeholder="Express yourself, we’re here to listen." rows="3"></textarea>
                <div className="feed__input-options">
                    <label className="feed__input-anonymous">
                        <input type="checkbox" className="feed__input-checkbox" />
                        Share anonymously
                    </label>
                    <select className="feed__input-privacy">
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button className="feed__input-button form__button form__button--primary">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </> );
}
 
export default PostStatus;