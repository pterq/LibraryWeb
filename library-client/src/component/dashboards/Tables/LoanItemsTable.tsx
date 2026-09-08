import { useEffect, useMemo, useState } from "react";

import type { LoanResponse } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";

import apiLoans from "../../../api/apiLoans";
import TableAlert from "../../common/TableAlert";

const LoanItemsTable = ({ userId = null }: { userId?: number | null }) => {
	const [loans, setLoans] = useState<LoanResponse[]>([]);

	useEffect(() => {
		apiLoans
			.getLoans()
			.then((data) => {
				setLoans(data);
				console.log("Fetched Loan Items:", data);
			})
			.catch(console.error);
	}, []);

	const selectedUserId = userId ?? null;

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | LoanResponse["status"]>("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof LoanResponse;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filter !== "ALL" || sortConfig !== null;

	const requestSort = (key: keyof LoanResponse) => {
		if (key === "status") return;

		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof LoanResponse) => {
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
					case "user":
						aVal = `${a.user.firstName} ${a.user.lastName}`;
						bVal = `${b.user.firstName} ${b.user.lastName}`;
						break;
					case "copy":
						aVal = a.copy.inventoryCode;
						bVal = b.copy.inventoryCode;
						break;
					case "reservedAt":
						aVal = new Date(a.reservedAt).getTime();
						bVal = new Date(b.reservedAt).getTime();
						break;
					case "expiresAt":
						aVal = new Date(a.expiresAt).getTime();
						bVal = new Date(b.expiresAt).getTime();
						break;
					default:
						aVal = a[sortConfig.key as keyof LoanResponse] as string | number;
						bVal = b[sortConfig.key as keyof LoanResponse] as string | number;
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
			<table className="table table-striped table-hover shadow">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("loanId")}>
							# {getSortIcon("loanId")}
						</th>
						<th scope="col" onClick={() => requestSort("loanId")}>
							Loan ID {getSortIcon("loanId")}
						</th>
						<th scope="col" onClick={() => requestSort("user")}>
							(ID) User {getSortIcon("user")}
						</th>
						<th scope="col" onClick={() => requestSort("copy")}>
							(Inventory Code) Book {getSortIcon("copy")}
						</th>
						<th scope="col" onClick={() => requestSort("reservedAt")}>
							Reservation Date {getSortIcon("reservedAt")}
						</th>
						<th scope="col" onClick={() => requestSort("expiresAt")}>
							Expire Date {getSortIcon("expiresAt")}
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
										setFilter(e.target.value as "ALL" | LoanResponse["status"])
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
						<tr key={loan.loanId}>
							<td>
								{sortConfig?.key === "loanId" && sortConfig?.direction === "desc"
									? processedLoans.length - index
									: index + 1}
							</td>
							<td>{loan.loanId}</td>
							<td>
								({loan.user.id}) {loan.user.firstName} {loan.user.lastName}
							</td>
							<td>
								({loan.copy.inventoryCode}) {loan.copy.book.title}
							</td>
							<td>{new Date(loan.reservedAt).toLocaleDateString()}</td>
							<td>{new Date(loan.expiresAt).toLocaleDateString()}</td>
							<td>
								{loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : "-"}
							</td>
							<td>
								{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "-"}
							</td>
							<td>
								{loan.returnDate
									? new Date(loan.returnDate).toLocaleDateString()
									: "-"}
							</td>
							<td>{loan.status}</td>
							<td className="text-nowrap">
								<button
									className="btn btn-sm btn-primary me-2"
									onClick={() =>
										(window.location.href = `/loanItem/view/${loan.loanId}`)
									}
								>
									Details
								</button>
								<button className="btn btn-sm btn-success me-1">Rent</button>
								<button className="btn btn-sm btn-warning me-1">Return</button>
								<button className="btn btn-sm btn-danger me-1">Set Overdue</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<TableAlert count={processedLoans.length} message="No items found." />
		</>
	);
};

export default LoanItemsTable;
