import React from 'react';
import Header from '../../components/Header';
import constructionPhoto from '../../assets/images/under-construction.png';
import './Status.scss';

const UnderConstructionPage = () => {
    return ( <>
        <div className="page page-underconstructionpage">
            <div className="construction__bgWhite"></div>
            <div className="construction__bgDivider"></div>
            <Header />
            <div className="container container--construction">
                <div className="main">
                    <div className="col-md-8">
                        <h1 className="construction__title">Website Under Construction</h1>
                        <p className="construction__description">Our website is currently undergoing scheduled maintenance.<br />We will be back shortly. Thank you for your patience.</p>
                    </div>
                    <div className="construction__image-wrapper">
                        
                        <img className="construction__image" src={constructionPhoto} alt="Under Construction" />
                    </div>
                </div>
            </div>
        </div>
    </> );
}
 
export default UnderConstructionPage;