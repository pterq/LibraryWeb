import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { LoanResponse, AuthorType } from "../../../../../types/DbTypes";
import SearchBar from "../../../../common/SearchBar";
import TableAlert from "../../../../common/TableAlert";
import apiLoans from "../../../../../api/apiLoans";

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
				setLoans(data);
				setLoading(false);
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

					case "loanDate":
						aVal = new Date(a.loanDate).getTime();
						bVal = new Date(b.loanDate).getTime();
						break;

					case "returnDate":
						aVal = new Date(a.returnDate).getTime();
						bVal = new Date(b.returnDate).getTime();
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
						<th onClick={() => requestSort("id")}># {getSortIcon("id")}</th>
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
					{processedLoans.map((loan, index) => {
						const book = loan.copy.book;

						const title = book?.title ?? "Unknown book";

						const authors = book?.authors?.length
							? book.authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ")
							: "Unknown author";

						return (
							<tr key={loan.id}>
								<td>
									{sortConfig?.key === "id" && sortConfig?.direction === "desc"
										? processedLoans.length - index
										: index + 1}
								</td>

								<td>{title}</td>

								<td>{authors}</td>

								<td>{new Date(loan.loanDate).toLocaleDateString()}</td>

								<td>{new Date(loan.returnDate).toLocaleDateString()}</td>

								<td>{loan.status}</td>

								<td>
									<Link to={`/user-loan/${loan.id}`}>View</Link>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<TableAlert count={processedLoans.length} message="No loans found." />
		</div>
	);
};

export default LoanItemsTable;
