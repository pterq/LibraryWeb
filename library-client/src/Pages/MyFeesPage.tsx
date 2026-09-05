import { useAuth } from "../context/AuthContext";
import FeeItemsTable from "../component/dashboards/CRUDs/User/Tables/FeeItemsTable";

const MyFeesPage = () => {
	const { userId, hasFees: userHasFees, setHasFees } = useAuth();

	return (
		<div className="container-fluid">
			<h2 className="d-flex justify-content-center mb-3">Your Fees</h2>

			{userHasFees && (
				<div className="alert alert-warning py-2 mb-3">You have outstanding fees.</div>
			)}

			<FeeItemsTable userId={userId!} />
		</div>
	);
};

export default MyFeesPage;
