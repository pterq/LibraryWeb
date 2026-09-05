import React from "react";

const CartItemsTable = ({ userId }: { userId: number }) => {
	return (
		<div>
			<h5>Of user: {userId}</h5>
		</div>
	);
};

export default CartItemsTable;
