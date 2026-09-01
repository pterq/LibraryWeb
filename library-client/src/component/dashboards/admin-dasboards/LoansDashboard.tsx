import { useMemo, useState } from "react";

import type { LoanType, LoanCountType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import { MockData } from "../../data/MockData";

const LoansDashboard = () => {
	const loansWithCount: LoanCountType[] = MockData.mockLoansCount;
	const [sortConfig, setSortConfig] = useState<{
		key: "index" | "userId" | "user" | "copyId" | "itemsCount";
		direction: "asc" | "desc";
	} | null>(null);

	const [search, setSearch] = useState("");

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: "index" | "userId" | "user" | "copyId" | "itemsCount") => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: "index" | "userId" | "user" | "copyId" | "itemsCount") => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const filteredAndSortedLoans = useMemo(() => {
		let data: LoanCountType[] = [...loansWithCount];

		if (search.trim()) {
			const lowerSearch = search.toLowerCase();

			data = data.filter((loan) => {
				const fullName = `${loan.firstName} ${loan.lastName}`.toLowerCase();

				return (
					String(loan.id).includes(lowerSearch) ||
					fullName.includes(lowerSearch) ||
					String(loan.id).includes(lowerSearch) ||
					String(loan.numberOfLoans).includes(lowerSearch)
				);
			});
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: string | number = "";
				let bVal: string | number = "";

				switch (sortConfig.key) {
					case "index":
						aVal = a.id + 1;
						bVal = b.id + 1;
						break;
					case "userId":
						aVal = a.id;
						bVal = b.id;
						break;
					case "user":
						aVal = `${a.firstName} ${a.lastName}`;
						bVal = `${b.firstName} ${b.lastName}`;
						break;
					case "itemsCount":
						aVal = a.numberOfLoans;
						bVal = b.numberOfLoans;
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
	}, [loansWithCount, search, sortConfig]);

	return (
		<div className="container-fluid">
			<h1>Loans Dashboard</h1>

			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search loan by user, book title, author or inventory code"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => (window.location.href = `/userLoans/add`)}
				>
					Create Users Loans Record
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
						<th scope="col" onClick={() => requestSort("itemsCount")}>
							Number of Items in Cart {getSortIcon("itemsCount")}
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedLoans.map((loan, index) => (
						<tr key={loan.id}>
							<td>{index + 1}</td>
							<td>{loan.id}</td>
							<td>{`${loan.firstName} ${loan.lastName}`}</td>
							<td>{loan.numberOfLoans}</td>
							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() =>
										(window.location.href = `/userLoans/view/${loan.id}`)
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

export default LoansDashboard;
