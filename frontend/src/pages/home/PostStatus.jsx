import React from 'react';
import userPhoto from '../../assets/images/profile-user-photo-1.png';

const PostStatus = () => {
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
                        <option value="public">🌐 Public</option>
                        <option value="friends">👫 Friends</option>
                        <option value="private">🔒 Private</option>
                    </select>
                </div>
            </div>
        </div>
    </> );
}
 
export default PostStatus;