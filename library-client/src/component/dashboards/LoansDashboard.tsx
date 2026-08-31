import React from "react";

import type { LoanType } from "../../types/DbTypes";

import { MockData } from "../data/MockData";

const LoansDashboard = () => {
	const loans: LoanType[] = MockData.mockLoans;

	return (
		<div className="container-fluid">
			<h1>Loans Dashboard</h1>

			{/* Loans table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Loan ID</th>
						<th scope="col">User</th>
						<th scope="col">Book</th>
						<th scope="col">Inventory Code</th>
						<th scope="col">Loan Date</th>
						<th scope="col">Due Date</th>
						<th scope="col">Return Date</th>
						<th scope="col">Status</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{loans.map((loan, index) => (
						<tr key={loan.id}>
							<td>{index + 1}</td>
							<td>{loan.id}</td>
							<td>
								{loan.user.firstName} {loan.user.lastName}
							</td>
							<td>{loan.bookPhysical.book.title}</td>
							<td>{loan.bookPhysical.inventoryCode}</td>
							<td>{loan.loanDate.toLocaleDateString()}</td>
							<td>{loan.dueDate.toLocaleDateString()}</td>
							<td>{loan.returnDate.toLocaleDateString()}</td>
							<td>{loan.status}</td>
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

export default LoansDashboard;
