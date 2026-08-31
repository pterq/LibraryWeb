import React from "react";

import type { FeeType } from "../../types/DbTypes";

import { MockData } from "../data/MockData";

const FeesDashboard = () => {
	const fees: FeeType[] = MockData.mockFees;

	return (
		<div className="container-fluid">
			<h1>Fees Dashboard</h1>

			{/* Fees table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">ID</th>
						<th scope="col">User ID</th>
						<th scope="col">Amount</th>
						<th scope="col">Due Date</th>
						<th scope="col">Status</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{fees.map((fee) => (
						<tr key={fee.id}>
							<td>{fee.id}</td>
							<td>{fee.user.userId}</td>
							<td>{fee.amount}</td>
							<td>{fee.loan.dueDate.toLocaleDateString()}</td>
							<td>{fee.status}</td>
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

export default FeesDashboard;
