import { useState } from "react";
import SearchBar from "../common/SearchBar";

import type { LoanType } from "../../types/LoanType";

import { Link } from "react-router-dom";

import { MockData } from "../data/MockData";

const UserBooksPage = () => {
	const [search, setSearch] = useState("");
	//const [loans, setLoans] = useState([]);

	//use mock data for now
	const loans: LoanType[] = MockData.mockLoans;

	return (
		<div>
			<h2>User's Books</h2>

			<SearchBar search={search} setSearch={setSearch} placeholder="Search Book by title" />

			<table className="table table-bordered table-hover shadow text-center">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Book Title</th>
						<th scope="col">Author</th>
						<th scope="col">Loan Date</th>
						<th scope="col">Return Date</th>
						<th scope="col">Status</th>
						<th scope="col">Action</th>
					</tr>
				</thead>
				<tbody className="text-center">
					{loans
						.filter((lo) =>
							lo.bookPhysical.book.title.toLowerCase().includes(search.toLowerCase()),
						)
						.map((loan, index) => (
							<tr key={loan.id}>
								<th scope="row" key={index}>
									{index + 1}
								</th>

								<td>{loan.bookPhysical.book.title}</td>
								<td>
									{loan.bookPhysical.book.authors.authors
										.map((a) => `${a.firstName} ${a.lastName}`)
										.join(", ")}
								</td>
								<td>{new Date(loan.loanDate).toLocaleDateString()}</td>
								<td>{new Date(loan.returnDate).toLocaleDateString()}</td>
								<td>{loan.status}</td>

								<td>
									<Link to={`/loans/${loan.id}`}>View</Link>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default UserBooksPage;
