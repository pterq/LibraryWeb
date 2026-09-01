import CartItemsTable from "../Tables/CartItemsTable";

const ShoppingCartItemsDashboard = () => {
	return (
		<div className="container-fluid">
			<h1>Shopping Carts Dashboard</h1>

			<CartItemsTable userId={null} />
		</div>
	);
};

export default ShoppingCartItemsDashboard;
