import { useState } from "react";
import SearchBar from "../common/SearchBar";

import type { LoanType } from "../../types/LoanType";
import type { BookType } from "../../types/BookType";
import type { UserType } from "../../types/UserType";
import { Link } from "react-router-dom";

import { MockData } from "../data/MockData";

const UserBooksPage = () => {
	const [search, setSearch] = useState("");
	//const [loans, setLoans] = useState([]);

	//use mock data for now
	const loans: LoanType[] = MockData.mockLoans;
	const user: UserType = MockData.mockUsers[0];

	return (
		<div>
			<h2>User's Books</h2>

			<SearchBar searchBook={search} setSearchBook={setSearch} />

			<table className="table table-bordered table-hover shadow text-center">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Book Title</th>
						<th scope="col">Author</th>
						<th scope="col">Loan Date</th>
						<th scope="col">Return Date</th>
						<th scope="col">Status</th>
						<th scope="col"></th>
					</tr>
				</thead>
				<tbody className="text-center">
					{loans
						.filter((lo) => lo.book.title.toLowerCase().includes(search))
						.map((loan, index) => (
							<tr key={loan.id}>
								<th scope="row" key={index}>
									{index + 1}
								</th>

								<td>{loan.book.title}</td>
								<td>
									{loan.book.authors.authors
										.map((a) => `${a.firstName} ${a.lastName}`)
										.join(", ")}
								</td>
								<td>{new Date(loan.loanDate).toLocaleDateString()}</td>
								<td>{new Date(loan.returnDate).toLocaleDateString()}</td>
								<td>{loan.status}</td>

								<td className="mx-2"></td>
								<td className="mx-2"></td>
								<td className="mx-2"></td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default UserBooksPage;
