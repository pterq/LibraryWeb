import React from "react";

import type { ReservationType } from "../../types/DbTypes";

import { MockData } from "../data/MockData";

const ShoppinCartsDashboard = () => {
	const shoppingCarts: ReservationType[] = MockData.mockReservations;

	return (
		<div className="container-fluid">
			<h1>Shopping Carts Dashboard</h1>

			{/* Shopping carts table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Reservation ID</th>
						<th scope="col">User ID</th>
						<th scope="col">Copy ID</th>
						<th scope="col">Reserved At</th>
						<th scope="col">Expires At</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{shoppingCarts.map((shoppingCart, index) => (
						<tr key={shoppingCart.id}>
							<td>{index + 1}</td>
							<td>{shoppingCart.id}</td>
							<td>{shoppingCart.userId}</td>
							<td>{shoppingCart.copyId}</td>
							<td>{shoppingCart.reservedAt.toLocaleDateString()}</td>
							<td>{shoppingCart.expiresAt.toLocaleDateString()}</td>
							<td>
								<button className="btn btn-sm btn-primary">Edit</button>
								<button className="btn btn-sm btn-danger">Delete</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ShoppinCartsDashboard;
