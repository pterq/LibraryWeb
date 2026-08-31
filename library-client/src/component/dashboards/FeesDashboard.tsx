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
						<th scope="col">#</th>
						<th scope="col">Fee ID</th>
						<th scope="col">User</th>
						<th scope="col">Amount</th>
						<th scope="col">Loan ID</th>
						<th scope="col">Created At</th>
						<th scope="col">Paid At</th>
						<th scope="col">Status</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{fees.map((fee, index) => (
						<tr key={fee.id}>
							<td>{index + 1}</td>
							<td>{fee.id}</td>
							<td>
								{fee.user.firstName} {fee.user.lastName}
							</td>
							<td>{fee.amount}</td>
							<td>{fee.loan.id}</td>
							<td>{fee.createdAt.toLocaleDateString()}</td>
							<td>{fee.paidAt ? fee.paidAt.toLocaleDateString() : "-"}</td>
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
