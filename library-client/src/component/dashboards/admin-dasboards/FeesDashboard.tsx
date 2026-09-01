import { useMemo, useState } from "react";

import type { FeeCountType } from "../../../types/DbTypes";
import { MockData } from "../../data/MockData";

import SearchBar from "../../common/SearchBar";

const FeesDashboard = () => {
	const feesWithCount: FeeCountType[] = MockData.mockFeesCount;

	const [search, setSearch] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key:
			| "id"
			| "userId"
			| "user"
			| "numberOfFees"
			| "numberOfFeesUnpaid"
			| "numberOfFeesPaid"
			| "numberOfFeesCancelled";
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (
		key:
			| "id"
			| "userId"
			| "user"
			| "numberOfFees"
			| "numberOfFeesUnpaid"
			| "numberOfFeesPaid"
			| "numberOfFeesCancelled",
	) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (
		key:
			| "id"
			| "userId"
			| "user"
			| "numberOfFees"
			| "numberOfFeesUnpaid"
			| "numberOfFeesPaid"
			| "numberOfFeesCancelled",
	) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const filteredAndSortedFees = useMemo(() => {
		let data: FeeCountType[] = [...feesWithCount];

		if (search.trim()) {
			const searchTerm = search.toLowerCase();
			data = data.filter((fee) => {
				const fullName = `${fee.firstName} ${fee.lastName}`.toLowerCase();
				return (
					fee.firstName.toLowerCase().includes(searchTerm) ||
					fee.lastName.toLowerCase().includes(searchTerm) ||
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
					case "userId":
						aVal = a.id;
						bVal = b.id;
						break;
					case "user":
						aVal = `${a.firstName} ${a.lastName}`;
						bVal = `${b.firstName} ${b.lastName}`;
						break;
					case "numberOfFees":
						aVal = a.numberOfFees;
						bVal = b.numberOfFees;
						break;
					case "numberOfFeesUnpaid":
						aVal = a.numberOfFeesUnpaid;
						bVal = b.numberOfFeesUnpaid;
						break;
					case "numberOfFeesPaid":
						aVal = a.numberOfFeesPaid;
						bVal = b.numberOfFeesPaid;
						break;
					case "numberOfFeesCancelled":
						aVal = a.numberOfFeesCancelled;
						bVal = b.numberOfFeesCancelled;
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

	return (
		<div className="container-fluid">
			<h1>Fees Dashboard</h1>

			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search fee by user name or ID"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => (window.location.href = `/userFees/add`)}
				>
					Create Users Fees Record
				</button>
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

			<table className="table table-striped table-hover shadow text-center">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col" onClick={() => requestSort("userId")}>
							User ID {getSortIcon("userId")}
						</th>
						<th scope="col" onClick={() => requestSort("user")}>
							User Name {getSortIcon("user")}
						</th>
						<th scope="col" onClick={() => requestSort("numberOfFees")}>
							Total Fees {getSortIcon("numberOfFees")}
						</th>
						<th scope="col" onClick={() => requestSort("numberOfFeesUnpaid")}>
							Fees UNPAID {getSortIcon("numberOfFeesUnpaid")}
						</th>
						<th scope="col" onClick={() => requestSort("numberOfFeesPaid")}>
							Fees PAID {getSortIcon("numberOfFeesPaid")}
						</th>
						<th scope="col" onClick={() => requestSort("numberOfFeesCancelled")}>
							Fees CANCELLED {getSortIcon("numberOfFeesCancelled")}
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedFees.map((fee, index) => (
						<tr key={fee.id}>
							<td>{index + 1}</td>
							<td>{fee.id}</td>
							<td>{`${fee.firstName} ${fee.lastName}`}</td>
							<td>{fee.numberOfFees}</td>
							<td>{fee.numberOfFeesUnpaid}</td>
							<td>{fee.numberOfFeesPaid}</td>
							<td>{fee.numberOfFeesCancelled}</td>
							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() =>
										(window.location.href = `/userFees/view/${fee.id}`)
									}
								>
									View Details
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default FeesDashboard;
