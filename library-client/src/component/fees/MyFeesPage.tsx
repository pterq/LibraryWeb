import { useState } from "react";

import type { FeeType } from "../../types/FeeType";
import type { BookType } from "../../types/BookType";

import SearchBar from "../common/SearchBar";

import { MockData } from "../data/MockData";
import { Link } from "react-router-dom";

const MyFeesPage = () => {
	const [search, setSearch] = useState("");

	//mock data for fees
	const fees: FeeType[] = MockData.mockFees;
	const books: BookType[] = MockData.mockBooks;

	{
		/*
[
    {
        "amount": 12.50,
        "createdAt": "2026-08-30T05:32:21.277376",
        "id": 3,
        "loan": {
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
        },
        "paidAt": null,
        "status": "CANCELLED",
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

	return (
		<div>
			<h2>My Fees</h2>

			<SearchBar searchBook={search} setSearchBook={setSearch} />

			<table className="table table-bordered table-hover shadow text-center">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Book Title</th>
						<th scope="col">Author</th>
						<th scope="col">Fee issue date</th>
						<th scope="col">Amount</th>
						<th scope="col">Fee Status</th>
						<th scope="col">Action</th>
					</tr>
				</thead>
				<tbody className="text-center">
					{fees
						.filter((fees) =>
							fees.loan.bookPhysical.book.title
								.toLowerCase()
								.includes(search.toLowerCase()),
						)
						.map((fees, index) => (
							<tr key={fees.id}>
								<th scope="row" key={index}>
									{index + 1}
								</th>

								<td>{fees.loan.bookPhysical.book.title}</td>
								<td>
									{fees.loan.bookPhysical.book.authors.authors
										.map((a) => `${a.firstName} ${a.lastName}`)
										.join(", ")}
								</td>
								<td>{new Date(fees.loan.loanDate).toLocaleDateString()}</td>
								<td>{fees.amount} zł</td>
								<td>{fees.status}</td>
								<td>
									<Link to={`/fees/${fees.id}`}>View</Link>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default MyFeesPage;
