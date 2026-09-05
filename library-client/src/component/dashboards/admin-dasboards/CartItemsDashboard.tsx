import CartItemsTable from "../Tables/CartItemsTable";

const CartItemsDashboard = () => {
	return (
		<div className="container-fluid">
			<h1>Shopping Carts Dashboard</h1>

			<CartItemsTable userId={null} />
		</div>
	);
};

export default CartItemsDashboard;
