import FeeItemsTable from "../../../../Pages/Tables/FeeItemsTable";

type Props = {
	userId: number;
};

const UserFeesView = ({ userId }: Props) => {
	return (
		<div>
			<h4 className="mb-3">Fees</h4>
			<h5>Of user: {userId}</h5>
			<FeeItemsTable userId={userId} />
		</div>
	);
};

export default UserFeesView;
