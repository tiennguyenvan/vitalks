import logo from '../assets/images/vitalks-logo.png';

const SiteLogo = () => {
	return ( 
		<a href="/">
			<img className="logo" alt='Site Logo' src={logo} />
		</a>
	 );
}

export default SiteLogo;