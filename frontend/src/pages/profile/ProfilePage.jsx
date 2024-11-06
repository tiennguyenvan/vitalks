import React from "react";
import Header from "../../components/Header";
import profileBG from "../../assets/images/profile-user-background.png";
import "./ProfilePage.scss";
import profileUser from "../../assets/images/profile-user-photo-1.png";
import SideBarItem from "../home/SideBarItem";
import Feed from "../home/Feed";

const ProfilePage = () => {
  return (
    <div className="page page-profile">
      <Header />
      <div className="container">
        <div className="main">
          <div className="star">
            <img id="profileStarBG" src={profileBG} alt="Background" />

            <div class="starinfo">
              <div class="avatar">
                <img
                  src={profileUser}
                  alt="Avatar"
                  style={{ height: 100, width: 100 }}
                />
              </div>

              <div class="details">
                <h2 id="userName">John Doe</h2>
                <div className="star_stats">
                  <div className="star_stat">
                    <strong>2,453</strong> Thoughts
                  </div>
                  <div className="star_stat">
                    <strong>9,999</strong> Listeners
                  </div>
                  <div className="star_stat">
                    <strong>499</strong> Following
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="star_gap">
            <br />
            <br />
            <br />
            <br />
          </div>

          <div className="row">
            <div className="row__sidebar col-md-4 col-sm-12">
              <SideBarItem title={"About"} url={"/"} />
            </div>
            <div className="row__feed col-md-8 col-sm-12">
              <Feed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
