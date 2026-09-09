import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { FeeType, FeeStatusType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import apiFees from "../../../api/apiFees";
import TableAlert from "../../common/TableAlert";

const FeeItemsTable = ({
	userId = null,
	mode = "user",
}: {
	userId?: number | null;
	mode?: "user" | "admin";
}) => {
	const selectedUserId = userId ?? null;

	const [fees, setFees] = useState<FeeType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (mode === "admin") {
			apiFees
				.getFees()
				.then((data) => {
					setFees(data);
					setLoading(false);
				})
				.catch(console.error);
		} else {
			if (!selectedUserId) return;

			apiFees
				.getFees()
				.then((data) => {
					const filtered = data.filter((fee) => fee.user.id === selectedUserId);
					setFees(filtered);
					setLoading(false);
				})
				.catch(console.error);
		}
	}, [mode, selectedUserId]);

	// ============================
	// Search / Filter / Sort
	// ============================

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FeeStatusType | "ALL">("ALL");
	const statusOptions: FeeStatusType[] = ["PAID", "PENDING", "CANCELLED"];

	const [sortConfig, setSortConfig] = useState<{
		key: keyof FeeType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filter !== "ALL" || sortConfig !== null;

	const requestSort = (key: keyof FeeType) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof FeeType) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const processedFees = useMemo(() => {
		let data = [...fees];

		// Filtrowanie statusu
		if (filter !== "ALL") {
			data = data.filter((fee) => fee.status === filter);
		}

		// Wyszukiwanie
		if (search) {
			const lower = search.toLowerCase();
			data = data.filter((fee) => {
				const fullName = `${fee.user.firstName} ${fee.user.lastName}`.toLowerCase();
				const bookTitle = fee.loan.copy.book.title.toLowerCase();
				const authors = fee.loan.copy.book.authors
					.map((a) => `${a.firstName} ${a.lastName}`)
					.join(" ")
					.toLowerCase();

				return (
					fullName.includes(lower) ||
					bookTitle.includes(lower) ||
					authors.includes(lower) ||
					String(fee.id).includes(lower) ||
					String(fee.loan.loanId).includes(lower)
				);
			});
		}

		// Sortowanie
		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: any = "";
				let bVal: any = "";

				switch (sortConfig.key) {
					case "id":
						aVal = a.id;
						bVal = b.id;
						break;

					case "user":
						aVal = `${a.user.firstName} ${a.user.lastName}`;
						bVal = `${b.user.firstName} ${b.user.lastName}`;
						break;

					case "amount":
						aVal = a.amount;
						bVal = b.amount;
						break;

					case "loan":
						aVal = a.loan.loanId;
						bVal = b.loan.loanId;
						break;

					case "createdAt":
						aVal = new Date(a.createdAt).getTime();
						bVal = new Date(b.createdAt).getTime();
						break;

					case "paidAt":
						aVal = a.paidAt ? new Date(a.paidAt).getTime() : -Infinity;
						bVal = b.paidAt ? new Date(b.paidAt).getTime() : -Infinity;
						break;

					default:
						aVal = a[sortConfig.key];
						bVal = b[sortConfig.key];
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
	}, [fees, filter, search, sortConfig]);

	// ============================
	// Render
	// ============================

	if (loading) {
		return <div className="alert alert-info py-2">Loading fees...</div>;
	}

	return (
		<>
			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search fee by user, fee ID, loan ID or book title"
			/>

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

			{/* ============================
                ADMIN TABLE
            ============================ */}
			{mode === "admin" ? (
				<table className="table table-striped table-hover shadow">
					<thead>
						<tr>
							<th onClick={() => requestSort("id")}># {getSortIcon("id")}</th>
							<th onClick={() => requestSort("id")}>Fee ID {getSortIcon("id")}</th>
							<th onClick={() => requestSort("user")}>
								(ID) User {getSortIcon("user")}
							</th>
							<th onClick={() => requestSort("amount")}>
								Amount {getSortIcon("amount")}
							</th>
							<th onClick={() => requestSort("loan")}>
								Loan / Inventory / Book {getSortIcon("loan")}
							</th>
							<th onClick={() => requestSort("createdAt")}>
								Created At {getSortIcon("createdAt")}
							</th>
							<th onClick={() => requestSort("paidAt")}>
								Paid At {getSortIcon("paidAt")}
							</th>
							<th scope="col" onClick={() => requestSort("status")}>
								<div className="d-flex align-items-center gap-2">
									<span>Status</span>
									<select
										className="form-select form-select-sm py-0 me-2"
										style={{ width: "auto" }}
										value={filter}
										onChange={(e) =>
											setFilter(e.target.value as FeeStatusType | "ALL")
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
						{processedFees.map((fee, index) => (
							<tr key={fee.id}>
								<td>{index + 1}</td>
								<td>{fee.id}</td>
								<td>
									({fee.user.id}) {fee.user.firstName} {fee.user.lastName}
								</td>
								<td>{fee.amount.toFixed(2)} zł</td>
								<td>
									({fee.loan.loanId}) {fee.loan.copy.inventoryCode} —{" "}
									{fee.loan.copy.book.title} (
									{fee.loan.copy.book.authors
										.map((a) => `${a.firstName} ${a.lastName}`)
										.join(", ")}
									)
								</td>
								<td>{new Date(fee.createdAt).toLocaleDateString()}</td>
								<td>
									{fee.paidAt ? new Date(fee.paidAt).toLocaleDateString() : "-"}
								</td>
								<td>{fee.status}</td>
								<td>
									<Link
										className="btn btn-sm btn-primary me-2"
										to={`/feeItem/view/${fee.id}`}
									>
										Details
									</Link>
									<button className="btn btn-sm btn-success">Mark as Paid</button>
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
							<th onClick={() => requestSort("id")}># {getSortIcon("id")}</th>
							<th onClick={() => requestSort("id")}>Fee ID {getSortIcon("id")}</th>
							<th onClick={() => requestSort("amount")}>
								Amount {getSortIcon("amount")}
							</th>
							<th onClick={() => requestSort("loan")}>
								Loan / Inventory / Book {getSortIcon("loan")}
							</th>
							<th onClick={() => requestSort("createdAt")}>
								Created At {getSortIcon("createdAt")}
							</th>
							<th onClick={() => requestSort("paidAt")}>
								Paid At {getSortIcon("paidAt")}
							</th>
							<th scope="col" onClick={() => requestSort("status")}>
								<div className="d-flex align-items-center gap-2">
									<span>Status</span>
									<select
										className="form-select form-select-sm py-0 me-2"
										style={{ width: "auto" }}
										value={filter}
										onChange={(e) =>
											setFilter(e.target.value as FeeStatusType | "ALL")
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
							<th>Action</th>
						</tr>
					</thead>

					<tbody>
						{processedFees.map((fee, index) => (
							<tr key={fee.id}>
								<td>{index + 1}</td>
								<td>{fee.id}</td>
								<td>{fee.amount.toFixed(2)} zł</td>
								<td>
									({fee.loan.loanId}) {fee.loan.copy.inventoryCode} —{" "}
									{fee.loan.copy.book.title} (
									{fee.loan.copy.book.authors
										.map((a) => `${a.firstName} ${a.lastName}`)
										.join(", ")}
									)
								</td>
								<td>{new Date(fee.createdAt).toLocaleDateString()}</td>
								<td>
									{fee.paidAt ? new Date(fee.paidAt).toLocaleDateString() : "-"}
								</td>
								<td>{fee.status}</td>
								<td>
									<Link to={`/feeItem/view/${fee.id}`}>View</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			<TableAlert count={processedFees.length} message="No items found." />
		</>
	);
};

export default FeeItemsTable;
