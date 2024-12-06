import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import HomePage from './pages/home/HomePage';
import CommunityPage from './pages/community/CommunityPage';
import MessagingPage from './pages/messaging/Messaging';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import ErrorPage from './pages/error/ErrorPage';
import { isUserLoggedIn } from './utils/Lib';
function App() {	
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					{isUserLoggedIn() ? <>						
						<Route path="/" element={<HomePage />} />
						<Route path="/community" element={<CommunityPage />} />
						<Route path="/messaging" element={<MessagingPage />} />
						<Route path="/notification" element={<NotificationPage />} />
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
