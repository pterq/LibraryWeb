import { useEffect, useMemo, useState } from "react";

import type { FeesCountType, FeeType, UserType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";

import apiFees from "../../../api/apiFees";
import TableAlert from "../../common/TableAlert";

import ViewFeeUserCount from "../CRUDs/Fee/ViewFeeUserCount";

type CrudState =
	| { mode: "dashboard" }
	| { mode: "view"; id: number }
	| { mode: "edit"; id: number }
	| { mode: "add" };

const FeesDashboard = () => {
	const [feesWithCount, setFeesWithCount] = useState<FeesCountType[]>([]);

	const [crud, setCrud] = useState<CrudState>({ mode: "dashboard" });
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"success" | "danger">("success");

	useEffect(() => {
		reloadFeeCounts();
	}, []);

	const reloadFeeCounts = () => {
		apiFees
			.getFeesWithCounts()
			.then((data) => {
				setFeesWithCount(data);
				console.log("Fetched fees with count:", data);
			})
			.catch(console.error);
	};

	const showMessage = (text: string, type: "success" | "danger" = "success") => {
		setMessage(text);
		setMessageType(type);
		setTimeout(() => setMessage(null), 3000);
	};

	const [search, setSearch] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof FeesCountType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: keyof FeesCountType) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof FeesCountType) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const filteredAndSortedFees = useMemo(() => {
		let data: FeesCountType[] = [...feesWithCount];

		if (search.trim()) {
			const searchTerm = search.toLowerCase();
			data = data.filter((fee) => {
				const fullName = `${fee.user.firstName} ${fee.user.lastName}`.toLowerCase();
				return (
					fee.user.firstName.toLowerCase().includes(searchTerm) ||
					fee.user.lastName.toLowerCase().includes(searchTerm) ||
					fullName.includes(searchTerm) ||
					String(fee.id).includes(searchTerm)
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
						aVal = a.user.id;
						bVal = b.user.id;
						break;
					case "user":
						aVal = `${a.user.firstName} ${a.user.lastName}`;
						bVal = `${b.user.firstName} ${b.user.lastName}`;
						break;
					case "countFees":
						aVal = a.countFees;
						bVal = b.countFees;
						break;
					case "countPending":
						aVal = a.countPending;
						bVal = b.countPending;
						break;
					case "countPaid":
						aVal = a.countPaid;
						bVal = b.countPaid;
						break;
					case "countCancelled":
						aVal = a.countCancelled;
						bVal = b.countCancelled;
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
	}, [feesWithCount, search, sortConfig]);

	// -----------------------------
	// RENDER CRUD
	// -----------------------------
	if (crud.mode === "view") {
		return (
			<ViewFeeUserCount
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadFeeCounts}
				showMessage={showMessage}
			/>
		);
	}

	return (
		<div className="container-fluid">
			<h1>Fees Report</h1>

			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search fee by user name"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-secondary btn-sm"
					disabled={!isFiltered}
					onClick={() => {
						setSearch("");
						setSortConfig(null);
					}}
				>
					Clear filters
				</button>
			</div>

			<table className="table table-striped table-hover shadow">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("user")}>
							(ID) User {getSortIcon("user")}
						</th>
						<th scope="col" onClick={() => requestSort("countFees")}>
							Total Fees {getSortIcon("countFees")}
						</th>
						<th scope="col" onClick={() => requestSort("countPending")}>
							Fees PENDING {getSortIcon("countPending")}
						</th>
						<th scope="col" onClick={() => requestSort("countPaid")}>
							Fees PAID {getSortIcon("countPaid")}
						</th>
						<th scope="col" onClick={() => requestSort("countCancelled")}>
							Fees CANCELLED {getSortIcon("countCancelled")}
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedFees.map((fee, index) => (
						<tr key={fee.id}>
							<td>
								{sortConfig?.key === "id" && sortConfig?.direction === "desc"
									? filteredAndSortedFees.length - index
									: index + 1}
							</td>
							<td>{`(${fee.user.id}) ${fee.user.firstName} ${fee.user.lastName}`}</td>
							<td>{fee.countFees}</td>
							<td>{fee.countPending}</td>
							<td>{fee.countPaid}</td>
							<td>{fee.countCancelled}</td>

							<td className="text-nowrap">
								<button
									className="btn btn-sm btn-primary me-2"
									onClick={() => setCrud({ mode: "view", id: fee.user.id })}
								>
									View Details
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<TableAlert count={filteredAndSortedFees.length} message="No fees found." />
		</div>
	);
};

export default FeesDashboard;
