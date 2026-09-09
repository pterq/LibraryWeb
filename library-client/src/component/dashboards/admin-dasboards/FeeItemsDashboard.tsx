import FeeItemsTable from "../Tables/FeeItemsTable";

const FeeItemsDashboard = () => {
	return (
		<div className="container-fluid">
			<h1>Fee Items Dashboar</h1>
			<FeeItemsTable mode="admin" />
		</div>
	);
};

export default FeeItemsDashboard;
