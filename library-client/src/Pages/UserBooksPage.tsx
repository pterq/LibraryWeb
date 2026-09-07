import { useAuth } from "../context/AuthContext";
import LoanItemsTable from "./Tables/LoanItemsTable";

const UserBooksPage = () => {
	const { userId } = useAuth();

	return (
		<div className="container-fluid">
			<h2 className="d-flex justify-content-center mb-3">Your Books</h2>

			{userId === null && (
				<div className="alert alert-info py-2 mb-3">No user id available.</div>
			)}

			<LoanItemsTable userId={userId!} />
		</div>
	);
};

export default UserBooksPage;
