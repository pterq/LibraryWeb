import { useMemo, useState } from "react";

import type { BookPhysicalType } from "../../types/DbTypes";

import { MockData } from "../data/MockData";
import SearchBar from "../common/SearchBar";

const PhysicalBooksDashboard = () => {
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<"ALL" | BookPhysicalType["status"]>("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filterStatus !== "ALL" || sortConfig !== null;

	const requestSort = (key: string) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: string) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const statusOptions = useMemo(
		() => Array.from(new Set(MockData.mockBookPhysicals.map((copy) => copy.status))),
		[],
	);

	const physicalBooks = useMemo(() => {
		let data: BookPhysicalType[] = [...MockData.mockBookPhysicals];

		if (search) {
			const lowerSearch = search.toLowerCase();
			data = data.filter(
				(copy) =>
					copy.inventoryCode.toLowerCase().includes(lowerSearch) ||
					copy.book.title.toLowerCase().includes(lowerSearch),
			);
		}

		if (filterStatus !== "ALL") {
			data = data.filter((copy) => copy.status === filterStatus);
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: number | string;
				let bVal: number | string;

				switch (sortConfig.key) {
					case "title":
						aVal = a.book.title;
						bVal = b.book.title;
						break;
					case "isbn":
						aVal = a.book.isbn;
						bVal = b.book.isbn;
						break;
					case "publishedYear":
						aVal = a.book.publishedYear;
						bVal = b.book.publishedYear;
						break;
					default:
						aVal = a[sortConfig.key as keyof BookPhysicalType] as number | string;
						bVal = b[sortConfig.key as keyof BookPhysicalType] as number | string;
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
	}, [search, filterStatus, sortConfig]);

	return (
		<div className="container-fluid">
			<h1>Physical Books Dashboard</h1>

			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search physical book by inventory code or title"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button className="btn btn-primary btn-sm me-2">Add Physical Book</button>

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

			{/* Physical books table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col" onClick={() => requestSort("id")}>
							Physical Book ID {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("isbn")}>
							ISBN {getSortIcon("isbn")}
						</th>
						<th scope="col" onClick={() => requestSort("inventoryCode")}>
							Inventory Code {getSortIcon("inventoryCode")}
						</th>
						<th scope="col" onClick={() => requestSort("title")}>
							Title {getSortIcon("title")}
						</th>

						<th scope="col" onClick={() => requestSort("publishedYear")}>
							Published Year {getSortIcon("publishedYear")}
						</th>
						<th scope="col" style={{ width: "16%" }}>
							<div className="d-flex align-items-center gap-2">
								<span onClick={() => requestSort("status")}>
									Status {getSortIcon("status")}
								</span>
								<select
									className="form-select form-select-sm py-0"
									style={{ width: "auto" }}
									value={filterStatus}
									onChange={(e) =>
										setFilterStatus(
											e.target.value as "ALL" | BookPhysicalType["status"],
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
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{physicalBooks.map((copy, index) => (
						<tr key={copy.id}>
							<td>{index + 1}</td>
							<td>{copy.book.id}</td>
							<td>{copy.book.isbn}</td>
							<td>{copy.inventoryCode}</td>
							<td>{copy.book.title}</td>

							<td>{copy.book.publishedYear}</td>
							<td>{copy.status}</td>
							<td>
								<button className="btn btn-sm btn-primary">View Details</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default PhysicalBooksDashboard;
