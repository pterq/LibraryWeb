import { useEffect, useMemo, useState } from "react";

import type { FeesWithCountsType, FeeType, UserType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";

import { getFeesWithCounts } from "../../../api/api";

const FeesDashboard = () => {
	const [feesWithCount, setFeesWithCount] = useState<FeesWithCountsType[]>([]);

	useEffect(() => {
		getFeesWithCounts()
			.then((data) => {
				setFeesWithCount(data);
				console.log("Fetched fees with count:", data);
			})
			.catch(console.error);
	}, []);
	// const feesWithCount: FeesWithCountsType[] = MockData.mockFeesCount;

	const [search, setSearch] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof FeesWithCountsType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: keyof FeesWithCountsType) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof FeesWithCountsType) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const filteredAndSortedFees = useMemo(() => {
		let data: FeesWithCountsType[] = [...feesWithCount];

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
					case "countUnpaid":
						aVal = a.countUnpaid;
						bVal = b.countUnpaid;
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
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("user")}>
							User ID {getSortIcon("user")}
						</th>
						<th scope="col" onClick={() => requestSort("user")}>
							User Name {getSortIcon("user")}
						</th>
						<th scope="col" onClick={() => requestSort("countFees")}>
							Total Fees {getSortIcon("countFees")}
						</th>
						<th scope="col" onClick={() => requestSort("countUnpaid")}>
							Fees UNPAID {getSortIcon("countUnpaid")}
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
							<td>{fee.id}</td>
							<td>{`${fee.user.firstName} ${fee.user.lastName}`}</td>
							<td>{fee.countFees}</td>
							<td>{fee.countUnpaid}</td>
							<td>{fee.countPaid}</td>
							<td>{fee.countCancelled}</td>
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
