import React from 'react';
import loginDivider from '../../assets/images/login-divider.png';
import './Login.scss';
import LoginForm from './LoginForm';
import SiteLogo from '../../components/SiteLogo';

const LoginPage = () => {
	return (<>
		<div className="row">
			<div className="col-md-7">
				<div className="hero">
					<div className="hero__body centered">
						<h2>Strengthening Mental Health Support to Empower Thriving Communities with <span className="yellow">ViTalks</span></h2>
					</div>

					<img alt='Login Divider' className="divider" src={loginDivider} />
				</div>
			</div>
			<div className="col-md-5">
				<div className="form">
					<SiteLogo />
					<LoginForm title={<>Welcome<br />Back</>} />
				</div>
			</div>
		</div>

	</>);
}

export default LoginPage;