import { useMemo, useState } from "react";
import type { AuthorType } from "../../../types/DbTypes";

import { MockData } from "../../../types/MockData";
import SearchBar from "../../common/SearchBar";

const AuthorsDashboard = () => {
	const authors: AuthorType[] = MockData.mockAuthors;
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | "A_M" | "N_Z">("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof AuthorType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filter !== "ALL" || sortConfig !== null;

	const requestSort = (key: keyof AuthorType) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof AuthorType) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const filteredAndSortedAuthors = useMemo(() => {
		let data = [...authors];

		if (search.trim()) {
			const searchTerm = search.toLowerCase();
			data = data.filter((author) => {
				const fullName = `${author.firstName} ${author.lastName}`.toLowerCase();
				return (
					fullName.includes(searchTerm) || author.bio.toLowerCase().includes(searchTerm)
				);
			});
		}

		if (sortConfig) {
			data.sort((a, b) => {
				const aVal = a[sortConfig.key];
				const bVal = b[sortConfig.key];

				if (typeof aVal === "number" && typeof bVal === "number") {
					return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
				}

				return sortConfig.direction === "asc"
					? String(aVal).localeCompare(String(bVal))
					: String(bVal).localeCompare(String(aVal));
			});
		}

		return data;
	}, [authors, filter, search, sortConfig]);

	return (
		<div className="container-fluid">
			<h1>Authors Dashboard</h1>

			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search author by name or biography"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => (window.location.href = `/author/add`)}
				>
					Add Author
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

			{/* Authors table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col" onClick={() => requestSort("id")}>
							ID {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("firstName")}>
							First Name {getSortIcon("firstName")}
						</th>
						<th scope="col" style={{ minWidth: "190px" }}>
							<div className="d-flex align-items-center gap-2">
								<span onClick={() => requestSort("lastName")}>
									Last Name {getSortIcon("lastName")}
								</span>
							</div>
						</th>
						<th scope="col" onClick={() => requestSort("bio")}>
							Biography {getSortIcon("bio")}
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedAuthors.map((author, index) => (
						<tr key={author.id}>
							<td>{index + 1}</td>
							<td>{author.id}</td>
							<td>{author.firstName}</td>
							<td>{author.lastName}</td>
							<td>{author.bio}</td>

							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() =>
										(window.location.href = `/author/view/${author.id}`)
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

export default AuthorsDashboard;
