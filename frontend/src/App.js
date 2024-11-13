import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import HomePage from './pages/home/HomePage';
import CommunityPage from './pages/community/CommunityPage';
import MessagingPage from './pages/messaging/Messaging';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/messaging" element={<MessagingPage />} />
                    <Route path="/notification" element={<NotificationPage />} />
                    
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* Add more routes here as needed 
					ex: <Route path="/" element={<HomePage />} />
					ex: <Route path="/profile" element={<ProfilePage />} />
					*/}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
