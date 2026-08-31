import React from "react";

import type { UserType } from "../../types/DbTypes";

import { MockData } from "../data/MockData";

const UsersDashboard = () => {
	const users: UserType[] = MockData.mockUsers;

	return (
		<div className="container-fluid">
			<h1>Users Dashboard</h1>

			{/* Users table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">User ID</th>
						<th scope="col">First Name</th>
						<th scope="col">Last Name</th>
						<th scope="col">Email</th>
						<th scope="col">Role</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => (
						<tr key={user.userId}>
							<td>{index + 1}</td>
							<td>{user.userId}</td>
							<td>{user.firstName}</td>
							<td>{user.lastName}</td>
							<td>{user.email}</td>
							<td>{user.role}</td>
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

export default UsersDashboard;
