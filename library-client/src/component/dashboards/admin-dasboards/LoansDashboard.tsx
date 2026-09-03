import { useMemo, useState } from "react";

import type { LoanType, LoanCountType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import { MockData } from "../../../types/MockData";

const LoansDashboard = () => {
	const loansWithCount: LoanCountType[] = MockData.mockLoansCount;
	const [sortConfig, setSortConfig] = useState<{
		key: keyof LoanCountType;
		direction: "asc" | "desc";
	} | null>(null);

	const [search, setSearch] = useState("");

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: keyof LoanCountType) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof LoanCountType) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const filteredAndSortedLoans = useMemo(() => {
		let data: LoanCountType[] = [...loansWithCount];

		if (search.trim()) {
			const lowerSearch = search.toLowerCase();

			data = data.filter((loan) => {
				const fullName = `${loan.user.firstName} ${loan.user.lastName}`.toLowerCase();

				return (
					String(loan.loanId).includes(lowerSearch) ||
					fullName.includes(lowerSearch) ||
					String(loan.loanId).includes(lowerSearch) ||
					String(loan.countLoans).includes(lowerSearch)
				);
			});
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: string | number = "";
				let bVal: string | number = "";

				switch (sortConfig.key) {
					case "userId":
						aVal = a.user.userId;
						bVal = b.user.userId;
						break;
					case "user":
						aVal = `${a.user.firstName} ${a.user.lastName}`;
						bVal = `${b.user.firstName} ${b.user.lastName}`;
						break;
					case "itemsCount":
						aVal = a.countLoans;
						bVal = b.countLoans;
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
						<th scope="col" onClick={() => requestSort("userId")}>
							# {getSortIcon("userId")}
						</th>
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
						<tr key={index + 1}>
							<td>
								{sortConfig?.key === "userId" && sortConfig?.direction === "desc"
									? filteredAndSortedLoans.length - index
									: index + 1}
							</td>
							<td>{loan.user.userId}</td>
							<td>{`${loan.user.firstName} ${loan.user.lastName}`}</td>
							<td>{loan.countLoans}</td>
							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() =>
										(window.location.href = `/userLoans/view/${loan.user.userId}`)
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
