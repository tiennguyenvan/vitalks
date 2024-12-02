import axios from "axios";
import Env from "./Env";


export const isUserLoggedIn = () => {
	const currentUserEmail = localStorage.getItem("email");
	const currentUserCode = localStorage.getItem("code");	
	return currentUserEmail && currentUserCode
}

export const getCurrentUserEmailCode = () => {
	const currentUserEmail = localStorage.getItem("email");
	const currentUserCode = localStorage.getItem("code");	
	return {
        email: currentUserEmail,
        code: currentUserCode
    };
}

export const fetchCurrentUser = async () => {
	const email = localStorage.getItem('email');
	const code = localStorage.getItem('code');

	if (!email || !code) {
		return null;
	}

	try {
		const response = await axios.post(`${Env.SERVER_URL}/users/get-user`, { email, code });		
		return response.data;
	} catch (error) {
		console.error('Error fetching current user:', error);
	}
}

export const redirectToLogin = () => {
	localStorage.removeItem('email');
	localStorage.removeItem('code');
	window.location.href = '/login';
}