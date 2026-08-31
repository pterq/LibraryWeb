import React from "react";

import type { BookType } from "../../types/DbTypes";

import { MockData } from "../data/MockData";

const BooksDashboard = () => {
	const books: BookType[] = MockData.mockBooks;

	return (
		<div className="container-fluid">
			<h1>Books Dashboard</h1>

			{/* Books table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Book ID</th>
						<th scope="col">Title</th>
						<th scope="col">ISBN</th>
						<th scope="col">Published Year</th>
						<th scope="col">Authors</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{books.map((book, index) => (
						<tr key={book.id}>
							<td>{index + 1}</td>
							<td>{book.id}</td>
							<td>{book.title}</td>
							<td>{book.isbn}</td>
							<td>{book.publishedYear}</td>
							<td>
								{book.authors.authors
									.map((author) => `${author.firstName} ${author.lastName}`)
									.join(", ")}
							</td>
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

export default BooksDashboard;
