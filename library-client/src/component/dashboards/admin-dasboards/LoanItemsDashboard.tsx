import LoanItemsTable from "../Tables/LoanItemsTable";

const LoanItemsDashboard = () => {
	return (
		<div className="container-fluid">
			<h1>Loans Dashboard</h1>

			<LoanItemsTable mode="admin" />
		</div>
	);
};

export default LoanItemsDashboard;
