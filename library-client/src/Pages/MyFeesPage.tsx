import { useAuth } from "../context/AuthContext";
import FeeItemsTable from "../component/dashboards/Tables/FeeItemsTable";

const MyFeesPage = () => {
	const { userId, hasFees, setHasFees } = useAuth();

	return (
		<div className="container-fluid">
			<h2 className="d-flex justify-content-center mb-3">Your Fees</h2>

			{hasFees && (
				<div className="alert alert-warning py-2 mb-3">
					<h5>You have unpaid fees</h5>
					Fees can be paid at the library counter.
				</div>
			)}

			<FeeItemsTable userId={userId!} />
		</div>
	);
};

export default MyFeesPage;
