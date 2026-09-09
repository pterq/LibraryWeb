import LoanItemsTable from "../../../../component/dashboards/Tables/LoanItemsTable";

type Props = {
	userId: number;
};

const UserLoansView = ({ userId }: Props) => {
	return (
		<div>
			<LoanItemsTable userId={userId} mode="admin" />
		</div>
	);
};

export default UserLoansView;
