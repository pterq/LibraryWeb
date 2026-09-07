import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { LoanResponse, AuthorType } from "../../types/DbTypes";
import SearchBar from "../../component/common/SearchBar";
import TableAlert from "../../component/common/TableAlert";
import apiLoans from "../../api/apiLoans";

type LoanExtended = LoanResponse & {
	authors: AuthorType[];
};

const LoanItemsTable = ({ userId }: { userId: number }) => {
	const [loans, setLoans] = useState<LoanResponse[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userId) return;

		apiLoans
			.getLoansByUserId(userId)
			.then((data) => {
				// usuwa rekordy RESERVED
				const filtered = data.filter((loan) => loan.status !== "RESERVED");

				setLoans(filtered);
				setLoading(false);

				console.log("Fetched User loans (filtered):", filtered);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, [userId]);

	// ============================
	// Search / Filter / Sort
	// ============================

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | "BORROWED" | "RETURNED" | "OVERDUE">("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof LoanExtended;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filter !== "ALL" || sortConfig !== null;

	const requestSort = (key: keyof LoanExtended) => {
		if (key === "status") return;

		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof LoanExtended) => {
		if (key === "status") return "";
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const processedLoans = useMemo(() => {
		let data = [...loans];

		if (filter !== "ALL") {
			data = data.filter((loan) => loan.status === filter);
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: any;
				let bVal: any;

				switch (sortConfig.key) {
					case "copy":
						aVal = a.copy.inventoryCode;
						bVal = b.copy.inventoryCode;
						break;

					case "authors":
						aVal = a.copy.book?.title ?? "";
						bVal = b.copy.book?.title ?? "";
						break;
					default:
						aVal = a[sortConfig.key as keyof LoanResponse];
						bVal = b[sortConfig.key as keyof LoanResponse];
				}

				if (typeof aVal === "number" && typeof bVal === "number") {
					return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
				}

				return sortConfig.direction === "asc"
					? String(aVal).localeCompare(String(bVal))
					: String(bVal).localeCompare(String(aVal));
			});
		}

		return data.filter((loan) => {
			const title = loan.copy.book?.title ?? "";
			return title.toLowerCase().includes(search.toLowerCase());
		});
	}, [loans, filter, sortConfig, search]);

	// ============================
	// Render
	// ============================

	if (loading) {
		return <div className="alert alert-info py-2">Loading loans...</div>;
	}

	return (
		<div>
			<h5>User ID: {userId}</h5>

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

			<table className="table table-striped table-hover shadow">
				<thead>
					<tr>
						<th onClick={() => requestSort("loanId")}># {getSortIcon("loanId")}</th>
						<th onClick={() => requestSort("copy")}>
							Book Title {getSortIcon("copy")}
						</th>
						<th onClick={() => requestSort("authors")}>
							Author {getSortIcon("authors")}
						</th>
						<th onClick={() => requestSort("reservedAt")}>
							Reserved At {getSortIcon("reservedAt")}
						</th>
						<th onClick={() => requestSort("expiresAt")}>
							Expires At {getSortIcon("expiresAt")}
						</th>
						<th onClick={() => requestSort("loanDate")}>
							Loan Date {getSortIcon("loanDate")}
						</th>
						<th onClick={() => requestSort("returnDate")}>
							Return Date {getSortIcon("returnDate")}
						</th>

						<th className="text-start" style={{ width: "5%" }}>
							<div className="d-flex align-items-center gap-2">
								<span>Status</span>
								<select
									className="form-select form-select-sm py-0"
									style={{ width: "auto" }}
									value={filter}
									onChange={(e) => setFilter(e.target.value as any)}
								>
									<option value="ALL">All</option>
									<option value="BORROWED">Borrowed</option>
									<option value="RETURNED">Returned</option>
									<option value="OVERDUE">Overdue</option>
								</select>
							</div>
						</th>
						<th>Action</th>
					</tr>
				</thead>

				<tbody>
					{processedLoans.map((loan, index) => (
						<tr key={loan.loanId}>
							<td>
								{sortConfig?.key === "loanId" && sortConfig?.direction === "desc"
									? processedLoans.length - index
									: index + 1}
							</td>

							<td>{loan.copy.book.title}</td>

							<td>
								{loan.copy.book.authors
									.map((author) => author.firstName + " " + author.lastName)
									.join(", ")}
							</td>

							<td>{new Date(loan.reservedAt).toLocaleDateString()}</td>

							<td>{new Date(loan.expiresAt).toLocaleDateString()}</td>

							<td>
								{loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : "-"}
							</td>
							<td>
								{loan.returnDate
									? new Date(loan.returnDate).toLocaleDateString()
									: "-"}
							</td>

							<td>{loan.status}</td>

							<td>
								<Link to={`/user-loan/${loan.loanId}`}>View</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<TableAlert count={processedLoans.length} message="No loans found." />
		</div>
	);
};

export default LoanItemsTable;
