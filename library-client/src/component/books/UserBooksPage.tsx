import { useState } from "react";
import SearchBar from "../common/SearchBar";

import type { LoanType } from "../../types/LoanType";
import type { Book } from "../../types/Book";
import { Link } from "react-router-dom";

{
	/*
[
    {
        "copy": {
            "book": {
                "bookAuthors": [],
                "category": null,
                "description": "A handbook of agile software craftsmanship",
                "id": 2,
                "isbn": "9780132350884",
                "publishedYear": 2008,
                "title": "Clean Code"
            },
            "createdAt": "2026-08-30T04:29:26.669671",
            "id": 3,
            "inventoryCode": "INV-2026-0021",
            "status": "AVAILABLE",
            "updatedAt": "2026-08-30T05:27:36.476013"
        },
        "dueDate": "2026-09-13T10:00:00",
        "id": 1,
        "loanDate": "2026-08-30T04:42:43.95786",
        "returnDate": "2026-08-30T05:27:36.492792",
        "status": "RETURNED",
        "user": {
            "createdAt": "2026-08-30T04:20:00.16212",
            "email": "jan.kowalski@example.com",
            "firstName": "Jan",
            "id": 1,
            "lastName": "Kowalski",
            "passwordHash": "hashed_password_123",
            "phone": "+48123456789",
            "role": "USER",
            "updatedAt": "2026-08-30T04:20:00.16212"
        }
    }
]
	
	*/
}

const UserBooksPage = () => {
	const [search, setSearch] = useState("");
	//const [loans, setLoans] = useState([]);

	//mock books data
	const books: Book[] = Array.from({ length: 46 }).map((_, i) => ({
		id: i + 1,
		title: `Book Title ${i + 1}`,
		description: `Description for book ${i + 1}`,
		isbn: `9780132350884`,
		publishedYear: 2008,
		bookAuthors: [`Author ${i + 1}`],
	}));

	//mock loans data
	const loans: LoanType[] = Array.from({ length: 46 }).map((_, i) => ({
		id: i + 1,
		book: (books[i] = {
			id: i + 1,
			title: `Book Title ${i + 1}`,
			description: `Description for book ${i + 1}`,
			isbn: `9780132350884`,
			publishedYear: 2008,
			bookAuthors: [`Author ${i + 1}`],
		}),
		loanDate: new Date().toISOString(),
		returnDate: new Date().toISOString(),
		dueDate: new Date().toISOString(),
		status: "RETURNED",
		user: {
			id: 1,
			firstName: "Jan",
			lastName: "Kowalski",
			email: "jan.kowalski@example.com",
		},
	}));

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
								<td>{loan.book.bookAuthors.join(", ")}</td>
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
