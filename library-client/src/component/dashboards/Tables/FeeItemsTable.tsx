import { useEffect, useMemo, useState } from "react";

import type { FeeType, FeeStatusType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import apiFees from "../../../api/apiFees";
import TableAlert from "../../common/TableAlert";

const FeeItemsTable = ({ userId = null }: { userId?: number | null }) => {
	const selectedUserId = userId ?? null;

	const [fees, setFees] = useState<FeeType[]>([]);

	useEffect(() => {
		apiFees
			.getFees()
			.then((data) => {
				setFees(data);
				console.log("Fetched fees:", data);
			})
			.catch(console.error);
	}, []);

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | "PAID" | "UNPAID" | "CANCELLED">("ALL");

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

	const filteredFees: FeeType[] = useMemo(() => {
		let data = [...fees];

		if (selectedUserId !== null) {
			data = data.filter((fee) => fee.user.id === selectedUserId);
		}

		if (filter !== "ALL") {
			data = data.filter((fee) => fee.status === filter);
		}

		if (search) {
			const lowerSearch = search.toLowerCase();
			data = data.filter((fee) => {
				const fullName = `${fee.user.firstName} ${fee.user.lastName}`.toLowerCase();
				return (
					fullName.includes(lowerSearch) ||
					String(fee.id).includes(lowerSearch) ||
					String(fee.loan.id).includes(lowerSearch)
				);
			});
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: string | number = "";
				let bVal: string | number = "";

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
						aVal = a.loan.id;
						bVal = b.loan.id;
						break;
					case "createdAt":
						aVal = new Date(a.createdAt).getTime();
						bVal = new Date(b.createdAt).getTime();
						break;
					case "paidAt":
						aVal = a.paidAt ? new Date(a.paidAt).getTime() : -Infinity;
						bVal = b.paidAt ? new Date(b.paidAt).getTime() : -Infinity;
						break;
					case "user":
						aVal = a.user.id;
						bVal = b.user.id;
						break;
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
	}, [fees, search, filter, sortConfig, selectedUserId]);

	return (
		<>
			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search fee by user, fee ID or loan ID"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => (window.location.href = `/feeItem/add`)}
				>
					Add Fee
				</button>

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

			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("id")}>
							Fee ID {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("user")}>
							(ID) User {getSortIcon("user")}
						</th>
						<th scope="col" onClick={() => requestSort("amount")}>
							Amount {getSortIcon("amount")}
						</th>
						<th scope="col" onClick={() => requestSort("loan")}>
							(Loan ID) Inventory Code (Book Title) {getSortIcon("loan")}
						</th>
						<th scope="col" onClick={() => requestSort("createdAt")}>
							Created At {getSortIcon("createdAt")}
						</th>
						<th scope="col" onClick={() => requestSort("paidAt")}>
							Paid At {getSortIcon("paidAt")}
						</th>
						<th scope="col">
							<div className="d-flex align-items-center gap-2">
								<span>Status</span>
								<select
									className="form-select form-select-sm py-0"
									style={{ width: "auto" }}
									value={filter}
									onChange={(e) =>
										setFilter(e.target.value as FeeStatusType | "ALL")
									}
								>
									<option value="ALL">All</option>
									<option value="PAID">Paid</option>
									<option value="UNPAID">Unpaid</option>
									<option value="CANCELLED">Cancelled</option>
								</select>
							</div>
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredFees.map((fee, index) => (
						<tr key={fee.id}>
							<td>{index + 1}</td>
							<td>{fee.id}</td>
							<td>{`(${fee.user.id}) ${fee.user.firstName} ${fee.user.lastName}`}</td>
							<td>{fee.amount.toFixed(2)} zł</td>
							<td>
								{`(${fee.loan.id}) ${fee.loan.copy.inventoryCode} (${fee.loan.copy.book.title} (${
									fee.loan.copy.book.authors?.length
										? fee.loan.copy.book.authors
												.map((a) => `${a.firstName} ${a.lastName}`)
												.join(", ")
										: "-"
								}))`}
							</td>

							<td>{new Date(fee.createdAt).toLocaleDateString()}</td>
							<td>{fee.paidAt ? new Date(fee.paidAt).toLocaleDateString() : "-"}</td>
							<td>{fee.status}</td>
							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() =>
										(window.location.href = `/feeItem/view/${fee.id}`)
									}
								>
									View Details
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<TableAlert count={filteredFees.length} message="No items found." />
		</>
	);
};

export default FeeItemsTable;
