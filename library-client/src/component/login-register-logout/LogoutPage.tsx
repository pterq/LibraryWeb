import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const LogoutPage = () => {
	const { logout } = useAuth();

	useEffect(() => {
		logout();
		window.location.replace("/");
	}, [logout]);

	return (
		<div>
			<h1>Logout</h1>
		</div>
	);
};

export default LogoutPage;
