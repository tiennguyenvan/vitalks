export const isUserLoggedIn = () => {
	const currentUserEmail = localStorage.getItem("email");
	const currentUserCode = localStorage.getItem("code");
	if (!currentUserEmail || !currentUserCode) {
		return false;
	}
	return true;
}