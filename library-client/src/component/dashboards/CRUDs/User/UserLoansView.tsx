import LoanItemsTable from "../../../../Pages/Tables/LoanItemsTable";

type Props = {
	userId: number;
};

const UserLoansView = ({ userId }: Props) => {
	return (
		<div>
			<LoanItemsTable userId={userId} />
		</div>
	);
};

export default UserLoansView;
