import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LogoutPage = () => {
	const { logout } = useAuth();

	useEffect(() => {
		logout();
	}, [logout]);

	return (
		<div>
			<h1>Logout</h1>
			<Navigate to="/login" replace />
		</div>
	);
};

export default LogoutPage;
