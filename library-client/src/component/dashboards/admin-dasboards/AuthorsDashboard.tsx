import { useMemo, useState } from "react";
import type { AuthorType, UserType } from "../../../types/DbTypes";
import { useEffect } from "react";

import SearchBar from "../../common/SearchBar";

import { getAuthors } from "../../../api/api";

const AuthorsDashboard = () => {
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | "A_M" | "N_Z">("ALL");

	const [authors, setAuthors] = useState<AuthorType[]>([]);

	useEffect(() => {
		getAuthors()
			.then((data) => {
				setAuthors(data);
				console.log("Fetched authors:", data);
			})
			.catch(console.error);
	}, []);

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
					fullName.includes(searchTerm) ||
					author.biography.toLowerCase().includes(searchTerm)
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
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("id")}>
							Author ID {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("firstName")}>
							First Name {getSortIcon("firstName")}
						</th>
						<th scope="col" style={{ maxWidth: "190px" }}>
							<div className="d-flex align-items-center gap-2">
								<span onClick={() => requestSort("lastName")}>
									Last Name {getSortIcon("lastName")}
								</span>
							</div>
						</th>
						<th scope="col" onClick={() => requestSort("biography")}>
							Biography {getSortIcon("biography")}
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedAuthors.map((author, index) => (
						<tr key={author.id}>
							<td>
								{sortConfig?.key === "id" && sortConfig?.direction === "desc"
									? filteredAndSortedAuthors.length - index
									: index + 1}
							</td>
							<td>{author.id}</td>
							<td>{author.firstName}</td>
							<td>{author.lastName}</td>
							<td>{author.biography?.substring(0, 100) || "-"}</td>

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
