import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/profile/ProfilePage';
import ErrorPage from './pages/status/UnderConstructionPage';
import { isUserLoggedIn } from './utils/Lib';
function App() {	
	
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					{isUserLoggedIn() ? <>						
						<Route path="/" element={<HomePage />} />
						<Route path="/profile/:id" element={<ProfilePage />} />						
						<Route path="*" element={<ErrorPage />} />
					</> : 
					<>						    
						<Route path="*" element={<Navigate to="/login" />} />
					</>
					}					
				</Routes>
			</div>
		</Router>
	);
}

export default App;
