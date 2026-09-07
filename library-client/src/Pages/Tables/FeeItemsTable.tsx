import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { AuthorType, FeeType } from "../../types/DbTypes";
import SearchBar from "../../component/common/SearchBar";
import TableAlert from "../../component/common/TableAlert";
import apiFees from "../../api/apiFees";

type FeeExtendedType = FeeType & {
	authors: AuthorType[];
	title: string;
};

const FeeItemsTable = ({ userId }: { userId: number }) => {
	const [fees, setFees] = useState<FeeType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userId) return;

		apiFees
			.getFeesByUserId(userId)
			.then((data) => {
				setFees(data);
				setLoading(false);
				console.log("Fetched User fees:", data);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, [userId]);

	// ============================
	// Search / Filter / Sort
	// ============================

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | "PAID" | "UNPAID" | "CANCELLED">("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof FeeExtendedType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filter !== "ALL" || sortConfig !== null;

	const requestSort = (key: keyof FeeExtendedType) => {
		if (key === "status") return;

		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof FeeExtendedType) => {
		if (key === "status") return "";
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const processedFees = useMemo(() => {
		let data = [...fees];

		if (filter !== "ALL") {
			data = data.filter((fee) => fee.status === filter);
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: any;
				let bVal: any;

				switch (sortConfig.key) {
					case "title":
						aVal = a.loan.copy.book?.title ?? "";
						bVal = b.loan.copy.book?.title ?? "";
						break;
					case "authors":
						aVal =
							a.loan.copy.book?.authors
								?.map((x) => `${x.firstName} ${x.lastName}`)
								.join(", ") ?? "";
						bVal =
							b.loan.copy.book?.authors
								?.map((x) => `${x.firstName} ${x.lastName}`)
								.join(", ") ?? "";
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

		return data.filter((fee) => {
			const title = fee.loan.copy.book?.title ?? "";
			return title.toLowerCase().includes(search.toLowerCase());
		});
	}, [fees, filter, sortConfig, search]);

	// ============================
	// Render
	// ============================

	if (loading) {
		return <div className="alert alert-info py-2">Loading fees...</div>;
	}

	return (
		<div>
			<SearchBar search={search} setSearch={setSearch} placeholder="Search Fee by title" />

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

			<table className="table table-striped table-hover shadow">
				<thead>
					<tr>
						<th onClick={() => requestSort("id")}># {getSortIcon("id")}</th>

						<th onClick={() => requestSort("title")}>
							Book Title {getSortIcon("title")}
						</th>

						<th onClick={() => requestSort("authors")}>
							Author {getSortIcon("authors")}
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
					{processedFees.map((fee, index) => {
						const book = fee.loan.copy.book;
						const title = book?.title ?? "Unknown book";
						const authors =
							book?.authors?.map((a) => `${a.firstName} ${a.lastName}`).join(", ") ??
							"Unknown author";

						return (
							<tr key={fee.id}>
								<td>{index + 1}</td>
								<td>{title}</td>
								<td>{authors}</td>
								<td>{new Date(fee.createdAt).toLocaleDateString()}</td>
								<td>{fee.amount.toFixed(2)} zł</td>
								<td>{fee.status}</td>
								<td>
									<Link to={`/fee/${fee.id}`}>View</Link>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<TableAlert count={processedFees.length} message="No fees found." />
		</div>
	);
};

export default FeeItemsTable;
