import LoanItemsTable from "../../../../Pages/Tables/LoanItemsTable";

type Props = {
	userId: number;
};

const UserLoansView = ({ userId }: Props) => {
	return (
		<div>
			<h4 className="mb-3">Books</h4>
			<h5>Of user: {userId}</h5>
			<LoanItemsTable userId={userId} />
		</div>
	);
};

export default UserLoansView;
