import React from 'react';
import Header from '../../components/Header';
import profileBG from '../../assets/images/profile-user-background.png';
import './ProfilePage.scss'
import profileUser from '../../assets/images/profile-user-photo-1.png';

const ProfilePage = () => {
	
    return (
        <div className="page page-profile">
            <Header />
            <div className="container">
                <div className="star">
                    <img id='profileStarBG' src= {profileBG} alt="Background"/>

                    <div class="profile-info">
                        <div class="avatar">
                            <img src= {profileUser} alt="Avatar" style={{height:100, width:100}}/>
                        </div>

                        <div class="details">
                            <h2>John Doe</h2>
                            <div class="stats">
                                <div class="stat">
                                    <p>2,453</p>
                                    <span>Thoughts</span>
                                </div>

                                <div class="stat">
                                    <p>9,999</p>
                                    <span>Listeners</span>
                                </div>

                                <div class="stat">
                                    <p>499</p>
                                    <span>Following</span>
                                </div>
                            </div>

                        </div>

                    </div>
                    
            
                </div>

                <div className="main">
                    <div className="row">
                        
                        <div className="col-md-3">   
                            <aside className="sidebar">
                                <div className="de">

                                </div>
                            </aside>                 
                           
                        </div>
                        <div className="col-md-9">
                            <div class = "posts" style={{backgroundColor:"grey", height:500, borderRadius:20}}>
                                
                            </div>
                           
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
     );
}
  
 export default ProfilePage;