import { useEffect, useMemo, useState } from "react";

import type { LoanType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import { MockData } from "../../../types/MockData";

import { getLoans } from "../../../api/api";

const LoanItemsTable = ({ userId = null }: { userId?: number | null }) => {
	const [loans, setLoans] = useState<LoanType[]>([]);

	useEffect(() => {
		getLoans()
			.then((data) => {
				setLoans(data);
				console.log("Fetched loans:", data);
			})
			.catch(console.error);
	}, []);

	const selectedUserId = userId ?? null;

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | LoanType["status"]>("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof LoanType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filter !== "ALL" || sortConfig !== null;

	const requestSort = (key: keyof LoanType) => {
		if (key === "status") return;

		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof LoanType) => {
		if (key === "status") return "";
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const statusOptions = useMemo(
		() => Array.from(new Set(loans.map((loan) => loan.status))),
		[loans],
	);

	const processedLoans = useMemo(() => {
		let data = [...loans];

		if (filter !== "ALL") {
			data = data.filter((loan) => loan.status === filter);
		}

		if (selectedUserId !== null && selectedUserId !== undefined) {
			data = data.filter((element) => element.user.id === selectedUserId);
		}

		if (search) {
			data = data.filter((loan) =>
				loan.copy.book.title.toLowerCase().includes(search.toLowerCase()),
			);
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: string | number = "";
				let bVal: string | number = "";
				a.copy;

				switch (sortConfig.key) {
					case "id":
						aVal = a.id;
						bVal = b.id;
						break;
					case "user":
						aVal = `${a.user.firstName} ${a.user.lastName}`;
						bVal = `${b.user.firstName} ${b.user.lastName}`;
						break;
					case "copy":
						aVal = a.copy.inventoryCode;
						bVal = b.copy.inventoryCode;
						break;
					case "loanDate":
						aVal = new Date(a.loanDate).getTime();
						bVal = new Date(b.loanDate).getTime();
						break;
					case "dueDate":
						aVal = new Date(a.dueDate).getTime();
						bVal = new Date(b.dueDate).getTime();
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
	}, [loans, filter, search, sortConfig, selectedUserId]);

	return (
		<>
			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search loan by book title"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => (window.location.href = `/loanItem/add`)}
				>
					Add Loan
				</button>

				<button
					className="btn btn-secondary btn-sm"
					disabled={!isFiltered}
					onClick={() => {
						setSearch("");
						setSortConfig(null);
						setFilter("ALL");
					}}
				>
					Clear filters
				</button>
			</div>

			{/* Loans table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("id")}>
							Loan ID {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("user")}>
							(ID) User {getSortIcon("user")}
						</th>
						<th scope="col" onClick={() => requestSort("copy")}>
							(Inventory Code) Book {getSortIcon("copy")}
						</th>
						<th scope="col" onClick={() => requestSort("loanDate")}>
							Loan Date {getSortIcon("loanDate")}
						</th>
						<th scope="col" onClick={() => requestSort("dueDate")}>
							Due Date {getSortIcon("dueDate")}
						</th>
						<th scope="col" onClick={() => requestSort("returnDate")}>
							Return Date {getSortIcon("returnDate")}
						</th>
						<th scope="col" style={{ width: "13%" }}>
							<div className="d-flex align-items-center gap-2">
								<span>Status</span>
								<select
									className="form-select form-select-sm py-0"
									style={{ width: "auto" }}
									value={filter}
									onChange={(e) =>
										setFilter(e.target.value as "ALL" | LoanType["status"])
									}
								>
									<option value="ALL">All</option>
									{statusOptions.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</div>
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{processedLoans.map((loan, index) => (
						<tr key={loan.id}>
							<td>
								{sortConfig?.key === "id" && sortConfig?.direction === "desc"
									? processedLoans.length - index
									: index + 1}
							</td>
							<td>{loan.id}</td>
							<td>
								({loan.user.id}) {loan.user.firstName} {loan.user.lastName}
							</td>
							<td>
								({loan.copy.inventoryCode}) {loan.copy.book.title}
							</td>
							<td>{new Date(loan.loanDate).toLocaleDateString()}</td>
							<td>{new Date(loan.dueDate).toLocaleDateString()}</td>
							<td>{new Date(loan.returnDate).toLocaleDateString()}</td>
							<td>{loan.status}</td>
							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() =>
										(window.location.href = `/loanItem/view/${loan.id}`)
									}
								>
									View Details
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};

export default LoanItemsTable;
