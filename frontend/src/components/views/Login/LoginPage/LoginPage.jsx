import React from 'react';
import logo from '../../../../assets/images/vitalks-logo.png';
import loginDivider from '../../../../assets/images/login-divider.png';
import './LoginPage.styles.css';
import LoginForm from './LoginForm';

const LoginPage = () => {
    return ( <>
        <div className="row">
            <div className="col-md-7">
                <div className="hero">
                    <div className="hero__body centered">
                        <h2>Strengthening Mental Health Support to Empower Thriving Communities with <span className="yellow">ViTalks</span></h2>
                    </div>

                    <img className="divider" src={loginDivider} />
                </div>
            </div>
            <div className="col-md-5"> 
                <div className="form">
                    <img className="logo" src={logo} />
                    <form className="form__element">
                        <h3 className="form__title">Welcome<br />Back</h3>
                        <LoginForm />
                    </form>
                </div>
            </div>
        </div>

    </> );
}
 
export default LoginPage;