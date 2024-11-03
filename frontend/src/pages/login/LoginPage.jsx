import React from 'react';
import loginDivider from '../../assets/images/login-divider.png';
import './Login.scss';
import LoginForm from './LoginForm';
import SiteLogo from '../../components/SiteLogo';

const LoginPage = () => {
	return (<>
		<div className="page page-login">
			<div className="row">
				<div className="row__hero col-md-7 col-sm-12">
					<div className="hero">
						<div className="hero__body centered">
							<h2>Strengthening Mental Health Support to Empower Thriving Communities with <span className="yellow">ViTalks</span></h2>
						</div>

						<img alt='Login Divider' className="divider" src={loginDivider} />
					</div>
				</div>
				<div className="row__form col-md-5 col-sm-12">
					<div className="form">
						<SiteLogo />
						<LoginForm title={<>Welcome Back</>} />
					</div>
				</div>
			</div>
		</div>
	</>);
}

export default LoginPage;