import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import LoanActionButtons from "../../dashboards/CRUDs/Loan/LoanActionButtons";
import ViewLoan from "../../dashboards/CRUDs/Loan/ViewLoan";
import AddLoan from "../../dashboards/CRUDs/Loan/AddLoan";

import SearchBar from "../../common/SearchBar";
import TableAlert from "../../common/TableAlert";

import apiLoans from "../../../api/apiLoans";
import { useAuth } from "../../../context/AuthContext";

import type { LoanResponse, AuthorType, LoanStatusType } from "../../../types/DbTypes";

type CrudState = { mode: "dashboard" } | { mode: "view"; id: number } | { mode: "add" };

type LoanExtended = LoanResponse & {
	authors: AuthorType[];
	inventoryCode: string;
};

const LoanItemsTable = ({
	userId = null,
	mode = "user",
}: {
	userId?: number | null;
	mode?: "user" | "admin";
}) => {
	const { notifyCartChanged } = useAuth();
	const location = useLocation();

	const [crud, setCrud] = useState<CrudState>({ mode: "dashboard" });
	const [loans, setLoans] = useState<LoanResponse[]>([]);
	const [loading, setLoading] = useState(true);

	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"success" | "danger">("success");

	const showMessage = (text: string, type: "success" | "danger" = "success") => {
		setMessage(text);
		setMessageType(type);
		setTimeout(() => setMessage(null), 3000);
	};

	useEffect(() => {
		reloadLoans();
	}, [notifyCartChanged]);

	const reloadLoans = () => {
		// ADMIN + userId → pobierz tylko wypożyczenia użytkownika
		if (mode === "admin" && userId) {
			apiLoans
				.getLoansByUserId(userId)
				.then((data) => {
					setLoans(data);
					setLoading(false);
				})
				.catch(console.error);
			return;
		}

		// ADMIN bez userId → pobierz wszystkie
		if (mode === "admin") {
			apiLoans
				.getLoans()
				.then((data) => {
					setLoans(data);
					setLoading(false);
				})
				.catch(console.error);
			return;
		}

		// USER → pobierz wypożyczenia użytkownika
		if (!userId) return;

		apiLoans
			.getLoansByUserId(userId)
			.then((data) => {
				let filtered = [...data];

				if (location.pathname === "/my-books") {
					filtered = filtered.filter((loan) => loan.status !== "RESERVED");
				}

				setLoans(filtered);
				setLoading(false);
			})
			.catch(console.error);
	};

	// ============================
	// Search / Filter / Sort
	// ============================

	const statusOptions: LoanStatusType[] = ["RESERVED", "BORROWED", "RETURNED", "OVERDUE"];
	const [filterStatus, setFilterStatus] = useState<"ALL" | LoanStatusType>("ALL");
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | LoanResponse["status"]>("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof LoanExtended;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filterStatus !== "ALL" || sortConfig !== null;

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

		// Filtrowanie statusów
		if (filterStatus !== "ALL") {
			data = data.filter((loan) => loan.status === filterStatus);
		}

		// Sortowanie
		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: any;
				let bVal: any;

				switch (sortConfig.key) {
					case "inventoryCode":
						aVal = a.copy.inventoryCode;
						bVal = b.copy.inventoryCode;
						break;
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

		// Wyszukiwanie
		return data.filter((loan) =>
			loan.copy.book.title.toLowerCase().includes(search.toLowerCase()),
		);
	}, [loans, filterStatus, sortConfig, search]);

	// ============================
	// CRUD VIEW
	// ============================

	if (crud.mode === "view") {
		return (
			<ViewLoan
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadLoans}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "add") {
		return (
			<AddLoan
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadLoans}
				showMessage={showMessage}
			/>
		);
	}

	// ============================
	// Render
	// ============================

	if (loading) {
		return <div className="alert alert-info py-2">Loading loans...</div>;
	}

	return (
		<>
			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search loan by book title"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-sm btn-primary me-2"
					onClick={() => setCrud({ mode: "add" })}
				>
					Add Loan
				</button>
				<button
					className="btn btn-secondary btn-sm"
					disabled={!isFiltered}
					onClick={() => {
						setSearch("");
						setFilterStatus("ALL");
						setSortConfig(null);
					}}
				>
					Clear filters
				</button>
			</div>

			{/* ============================
                ADMIN TABLE
            ============================ */}
			{mode === "admin" ? (
				<table className="table table-striped table-hover shadow">
					<thead>
						<tr>
							<th onClick={() => requestSort("loanId")}># {getSortIcon("loanId")}</th>
							<th onClick={() => requestSort("user")}>
								(ID) User {getSortIcon("user")}
							</th>
							<th onClick={() => requestSort("copy")}>Book {getSortIcon("copy")}</th>
							<th onClick={() => requestSort("reservedAt")}>
								Reserved At {getSortIcon("reservedAt")}
							</th>
							<th onClick={() => requestSort("expiresAt")}>
								Expires At {getSortIcon("expiresAt")}
							</th>
							<th onClick={() => requestSort("loanDate")}>
								Loaned At {getSortIcon("loanDate")}
							</th>
							<th onClick={() => requestSort("dueDate")}>
								Due At {getSortIcon("dueDate")}
							</th>
							<th onClick={() => requestSort("returnDate")}>
								Returned At {getSortIcon("returnDate")}
							</th>

							<th scope="col" style={{ width: "16%" }}>
								<div className="d-flex align-items-center gap-2">
									<span onClick={() => requestSort("status")}>
										Status {getSortIcon("status")}
									</span>
									<select
										className="form-select form-select-sm py-0 me-2"
										style={{ width: "auto" }}
										value={filterStatus}
										onChange={(e) =>
											setFilterStatus(
												e.target.value as "ALL" | LoanStatusType,
											)
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
							<th>Actions</th>
						</tr>
					</thead>

					<tbody>
						{processedLoans.map((loan, index) => (
							<tr key={loan.loanId}>
								<td>{index + 1}</td>
								<td>
									({loan.user.id}) {loan.user.firstName} {loan.user.lastName}
								</td>
								<td>{loan.copy.book.title}</td>
								<td>{new Date(loan.reservedAt).toLocaleDateString()}</td>
								<td>{new Date(loan.expiresAt).toLocaleDateString()}</td>
								<td>
									{loan.loanDate
										? new Date(loan.loanDate).toLocaleDateString()
										: "-"}
								</td>
								<td>
									{loan.dueDate
										? new Date(loan.dueDate).toLocaleDateString()
										: "-"}
								</td>
								<td>
									{loan.returnDate
										? new Date(loan.returnDate).toLocaleDateString()
										: "-"}
								</td>
								<td>{loan.status}</td>
								<td>
									<button
										className="btn btn-sm btn-primary me-2"
										onClick={() => setCrud({ mode: "view", id: loan.loanId })}
									>
										Details
									</button>
									<LoanActionButtons
										loanId={loan.loanId}
										loanStatus={loan.status}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				/* ============================
                    USER TABLE 
                ============================ */
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
							<th onClick={() => requestSort("inventoryCode")}>
								Inventory Code {getSortIcon("inventoryCode")}
							</th>
							<th onClick={() => requestSort("reservedAt")}>
								Reserved At {getSortIcon("reservedAt")}
							</th>
							<th onClick={() => requestSort("expiresAt")}>
								Expires At {getSortIcon("expiresAt")}
							</th>
							<th onClick={() => requestSort("loanDate")}>
								Loaned At {getSortIcon("loanDate")}
							</th>
							<th onClick={() => requestSort("returnDate")}>
								Returned At {getSortIcon("returnDate")}
							</th>
							<th scope="col" style={{ width: "16%" }}>
								<div className="d-flex align-items-center gap-2">
									<span onClick={() => requestSort("status")}>
										Status {getSortIcon("status")}
									</span>

									<select
										className="form-select form-select-sm py-0 me-2"
										style={{ width: "auto" }}
										value={filterStatus}
										onChange={(e) =>
											setFilterStatus(
												e.target.value as "ALL" | LoanStatusType,
											)
										}
									>
										<option value="ALL">All</option>

										{/*bez RESERVED  */}
										{["BORROWED", "RETURNED", "OVERDUE"].map((status) => (
											<option key={status} value={status}>
												{status}
											</option>
										))}
									</select>
								</div>
							</th>

							<th>Action</th>
						</tr>
					</thead>

					<tbody>
						{processedLoans
							.filter((loan) => loan.status !== "RESERVED")
							.map((loan, index) => (
								<tr key={loan.loanId}>
									<td>{index + 1}</td>

									<td>{loan.copy.book.title}</td>

									<td>
										{loan.copy.book.authors
											.map(
												(author) =>
													author.firstName + " " + author.lastName,
											)
											.join(", ")}
									</td>

									<td>{loan.copy.inventoryCode}</td>

									<td>{new Date(loan.reservedAt).toLocaleDateString()}</td>

									<td>{new Date(loan.expiresAt).toLocaleDateString()}</td>

									<td>
										{loan.loanDate
											? new Date(loan.loanDate).toLocaleDateString()
											: "-"}
									</td>

									<td>
										{loan.returnDate
											? new Date(loan.returnDate).toLocaleDateString()
											: "-"}
									</td>

									<td>{loan.status}</td>

									<td>
										<button
											className="btn btn-sm btn-primary me-2"
											onClick={() =>
												setCrud({ mode: "view", id: loan.loanId })
											}
										>
											Details
										</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}

			<TableAlert count={processedLoans.length} message="No items found." />
		</>
	);
};

export default LoanItemsTable;
