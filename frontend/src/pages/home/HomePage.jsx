import React from 'react';
import Header from '../../components/Header';
import SideBarItem from './SideBarItem';
import Feed from './Feed';
import userPhoto from '../../assets/images/profile-user-photo-1.png';
import './Home.scss';

const HomePage = () => {
    return ( <>
        <div className="page page-home">
            <Header />
            <div className="container">
                <div className="main">
                    <div className="row">
                        <div className="row__profile col-md-3 col-sm-12">                    
                            <aside className="sidebar">
                                <div className="profile">
                                    <img className="profile__background" src="https://placehold.co/200x100?text=Cover+Photo" alt="Background" />
                                    <div className="profile__info">
                                        <img className="profile__avatar" src={userPhoto} alt="Profile" />
                                        <div className="profile__name">John Doe</div>
                                        <div className="profile__details">Connecting the world one thought at a time</div>
                                        <div className="profile__stats">
                                            <div className="profile__stat"><strong>2,453</strong> Thoughts</div>
                                            <div className="profile__stat"><strong>9,999</strong> Listeners</div>
                                            <div className="profile__stat"><strong>499</strong> Following</div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                            <SideBarItem title={"Resources"} url={"/"} />
                        </div>
                        <div className="row__feed col-md-6 col-sm-12">
                            <Feed />
                        </div>
                        <div className="row__sidebar col-md-3 col-sm-12">
                            <SideBarItem title={"Activity"} url={"/"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </> );
}
 
export default HomePage;