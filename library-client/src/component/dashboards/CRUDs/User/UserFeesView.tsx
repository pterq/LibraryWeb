import FeeItemsTable from "../../../../Pages/Tables/FeeItemsTable";

type Props = {
	userId: number;
};

const UserFeesView = ({ userId }: Props) => {
	return (
		<div>
			<FeeItemsTable userId={userId} />
		</div>
	);
};

export default UserFeesView;
