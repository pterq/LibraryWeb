import React from "react";
import type { AuthorType, AuthorsType } from "../../types/AuthorsType";

import { MockData } from "../data/MockData";

const AuthorsDashboard = () => {
	const authors: AuthorType[] = MockData.mockAuthors;

	return (
		<div className="container-fluid">
			<h1>Authors Dashboard</h1>

			{/* Add author button*/}
			<div className="mb-3">
				<button className="btn btn-primary">Add Author</button>
			</div>

			{/* Authors table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">ID</th>
						<th scope="col">First Name</th>
						<th scope="col">Last Name</th>
						<th scope="col">Biography</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{authors.map((author) => (
						<tr key={author.id}>
							<td>{author.id}</td>
							<td>{author.firstName}</td>
							<td>{author.lastName}</td>
							<td>{author.bio}</td>

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

export default AuthorsDashboard;
