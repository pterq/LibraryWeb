import CartItemsTable from "./CartItemsTable";

type Props = {
	userId: number;
};

const UserCartTable = ({ userId }: Props) => {
	return (
		<div>
			<h4 className="mb-3">Cart items</h4>
			<h5>Of user: {userId}</h5>
			<CartItemsTable userId={userId} />
		</div>
	);
};

export default UserCartTable;
