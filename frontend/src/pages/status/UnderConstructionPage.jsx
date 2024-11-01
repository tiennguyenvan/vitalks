import React from 'react';
import Header from '../../components/Header';
import constructionPhoto from '../../assets/images/under-construction.png';
import './Status.scss';

const UnderConstructionPage = () => {
    return ( <>
        <div className="page page-underconstructionpage">
            <div class="construction__bgWhite"></div>
            <div class="construction__bgDivider"></div>
            <Header />
            <div className="container container--construction">
                <div className="main">
                    <div className="col-md-8">
                        <h1 class="construction__title">Website Under Construction</h1>
                        <p class="construction__description">Our website is currently undergoing scheduled maintenance.<br />We will be back shortly. Thank you for your patience.</p>
                    </div>
                    <div class="construction__image-wrapper">
                        
                        <img class="construction__image" src={constructionPhoto} alt="Under Construction Image" />
                    </div>
                </div>
            </div>
        </div>
    </> );
}
 
export default UnderConstructionPage;