import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../common/SearchBar";

import type { LoanType } from "../../types/DbTypes";

import { Link } from "react-router-dom";

import { MockData } from "../../types/MockData";

const UserBooksPage = () => {
	const { userId } = useAuth();

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | "BORROWED" | "RETURNED" | "OVERDUE">("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filter !== "ALL" || sortConfig !== null;

	const requestSort = (key: string) => {
		if (key === "status") return;

		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: string) => {
		if (key === "status") return "";
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};
	//const [loans, setLoans] = useState([]);

	//use mock data for now
	const loans: LoanType[] = useMemo(() => {
		if (userId === null) {
			return [];
		}

		let data = MockData.mockLoans.filter((loan) => loan.user.userId === userId);

		if (filter !== "ALL") {
			data = data.filter((loan) => loan.status === filter);
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: string | number;
				let bVal: string | number;

				switch (sortConfig.key) {
					case "title":
						aVal = a.bookPhysical.book.title;
						bVal = b.bookPhysical.book.title;
						break;
					case "author":
						aVal = a.bookPhysical.book.authors.authors
							.map((x) => `${x.firstName} ${x.lastName}`)
							.join(", ");
						bVal = b.bookPhysical.book.authors.authors
							.map((x) => `${x.firstName} ${x.lastName}`)
							.join(", ");
						break;
					case "loanDate":
						aVal = new Date(a.loanDate).getTime();
						bVal = new Date(b.loanDate).getTime();
						break;
					case "returnDate":
						aVal = new Date(a.returnDate).getTime();
						bVal = new Date(b.returnDate).getTime();
						break;
					default:
						aVal = a[sortConfig.key as keyof LoanType] as string | number;
						bVal = b[sortConfig.key as keyof LoanType] as string | number;
				}

				if (typeof aVal === "number" && typeof bVal === "number") {
					return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
				}

				return sortConfig.direction === "asc"
					? String(aVal).localeCompare(String(bVal))
					: String(bVal).localeCompare(String(aVal));
			});
		}

		return data;
	}, [filter, sortConfig, userId]);

	return (
		<div className="container-fluid">
			<h2>User's Books</h2>

			{userId === null && (
				<div className="alert alert-info py-2 mb-3">No user id available.</div>
			)}

			<SearchBar search={search} setSearch={setSearch} placeholder="Search Book by title" />

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-secondary btn-sm"
					disabled={!isFiltered}
					onClick={() => {
						setSearch("");
						setFilter("ALL");
						setSortConfig(null);
					}}
				>
					Clear filters
				</button>
			</div>

			<table className="table table-bordered table-hover shadow text-center">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("title")}>
							Book Title {getSortIcon("title")}
						</th>
						<th scope="col" onClick={() => requestSort("author")}>
							Author {getSortIcon("author")}
						</th>
						<th scope="col" onClick={() => requestSort("loanDate")}>
							Loan Date {getSortIcon("loanDate")}
						</th>
						<th scope="col" onClick={() => requestSort("returnDate")}>
							Return Date {getSortIcon("returnDate")}
						</th>
						<th scope="col" className="text-start" style={{ width: "5%" }}>
							<div className="d-flex align-items-center gap-2">
								<span>Status</span>
								<select
									className="form-select form-select-sm py-0"
									style={{ width: "auto" }}
									value={filter}
									onChange={(e) =>
										setFilter(
											e.target.value as
												| "ALL"
												| "BORROWED"
												| "RETURNED"
												| "OVERDUE",
										)
									}
								>
									<option value="ALL">All</option>
									<option value="BORROWED">Borrowed</option>
									<option value="RETURNED">Returned</option>
									<option value="OVERDUE">Overdue</option>
								</select>
							</div>
						</th>
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
									<Link to={`/user-loan/${loan.id}`}>View</Link>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default UserBooksPage;
