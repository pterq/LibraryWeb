import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { FeeType } from "../../types/DbTypes";
import SearchBar from "../common/SearchBar";
import { MockData } from "../../types/MockData";
import { useAuth } from "../../context/AuthContext";

const MyFeesPage = () => {
	const { hasFees: userHasFees, userId: authUserId, setHasFees } = useAuth();
	const [showOutstandingAlert, setShowOutstandingAlert] = useState(userHasFees);

	const userId = authUserId;

	useEffect(() => {
		if (!userHasFees) return;

		// Hide navbar indicator immediately after entering My Fees page.
		setHasFees(false);

		const alertTimeout = setTimeout(() => {
			setShowOutstandingAlert(false);
		}, 15_000);

		return () => clearTimeout(alertTimeout);
	}, [userHasFees, setHasFees]);

	//================================================

	//================================================

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | "PAID" | "UNPAID" | "CANCELLED">("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filter !== "ALL" || sortConfig !== null;

	const requestSort = (key: string) => {
		if (key === "status") return; // Fee Status NIE SORTUJE

		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: string) => {
		if (key === "status") return ""; // brak sortowania
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const fees = useMemo(() => {
		let data = [...MockData.mockFees];

		data = data.filter((fee) => fee.user.userId === userId);

		if (filter !== "ALL") {
			data = data.filter((fee) => fee.status === filter);
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: any;
				let bVal: any;

				switch (sortConfig.key) {
					case "title":
						aVal = a.loan.bookPhysical.book.title;
						bVal = b.loan.bookPhysical.book.title;
						break;
					case "author":
						aVal = a.loan.bookPhysical.book.authors.authors
							.map((x) => `${x.firstName} ${x.lastName}`)
							.join(", ");
						bVal = b.loan.bookPhysical.book.authors.authors
							.map((x) => `${x.firstName} ${x.lastName}`)
							.join(", ");
						break;
					case "createdAt":
						aVal = new Date(a.createdAt).getTime();
						bVal = new Date(b.createdAt).getTime();
						break;
					default:
						aVal = a[sortConfig.key as keyof FeeType];
						bVal = b[sortConfig.key as keyof FeeType];
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
	}, [filter, sortConfig, userId]);

	return (
		<div className="container-fluid">
			<h2>My Fees</h2>
			{showOutstandingAlert && (
				<div className="alert alert-warning py-2 mb-3">You have outstanding fees.</div>
			)}

			<SearchBar search={search} setSearch={setSearch} placeholder="Search Fee by title" />

			{/*Clear filters button*/}
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

			<table className="table table-bordered table-hover shadow text-center">
				<thead>
					<tr>
						<th onClick={() => requestSort("id")}># {getSortIcon("id")}</th>

						<th onClick={() => requestSort("title")}>
							Book Title {getSortIcon("title")}
						</th>

						<th onClick={() => requestSort("author")}>
							Author {getSortIcon("author")}
						</th>

						<th onClick={() => requestSort("createdAt")}>
							Fee issue date {getSortIcon("createdAt")}
						</th>

						<th onClick={() => requestSort("amount")}>
							Amount {getSortIcon("amount")}
						</th>

						<th className="text-start" style={{ width: "5%" }}>
							<div className="d-flex align-items-center gap-2">
								<span>Status</span>

								<select
									className="form-select form-select-sm py-0"
									style={{ width: "auto" }}
									value={filter}
									onChange={(e) => setFilter(e.target.value as any)}
								>
									<option value="ALL">All</option>
									<option value="PAID">Paid</option>
									<option value="UNPAID">Unpaid</option>
									<option value="CANCELLED">Cancelled</option>
								</select>
							</div>
						</th>

						<th>Action</th>
					</tr>
				</thead>

				<tbody>
					{fees
						.filter((fee) =>
							fee.loan.bookPhysical.book.title
								.toLowerCase()
								.includes(search.toLowerCase()),
						)
						.map((fee, index) => (
							<tr key={fee.id}>
								<td>{index + 1}</td>
								<td>{fee.loan.bookPhysical.book.title}</td>
								<td>
									{fee.loan.bookPhysical.book.authors.authors
										.map((a) => `${a.firstName} ${a.lastName}`)
										.join(", ")}
								</td>
								<td>{new Date(fee.createdAt).toLocaleDateString()}</td>
								<td>{fee.amount.toFixed(2)} zł</td>
								<td>{fee.status}</td>
								<td>
									<Link to={`/fee/${fee.id}`}>View</Link>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default MyFeesPage;
