import { useEffect, useMemo, useState } from "react";
import type { CategoryCountType, CategoriesWithCountsResponse } from "../../../types/DbTypes";

import { MockData } from "../../../types/MockData";
import SearchBar from "../../common/SearchBar";

import { getCategories, getCategoriesWithCounts } from "../../../api/api";

const CategoriesDashboard = () => {
	const [categoriesWithCount, setCategoriesWithCount] = useState<CategoriesWithCountsResponse>({
		categoriesWithCount: [],
	});

	useEffect(() => {
		getCategoriesWithCounts()
			.then((data) => setCategoriesWithCount(data))
			.catch(console.error);
	}, []);

	const [search, setSearch] = useState("");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof CategoryCountType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: keyof CategoryCountType) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof CategoryCountType) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const filteredAndSortedCategories = useMemo(() => {
		let data = [...(categoriesWithCount.categoriesWithCount ?? [])];

		if (search.trim()) {
			const searchTerm = search.toLowerCase();
			data = data.filter((category) => {
				return (
					category.name.toLowerCase().includes(searchTerm) ||
					String(category.id).includes(searchTerm)
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
	}, [categoriesWithCount, search, sortConfig]);

	return (
		<div className="container-fluid">
			<h1>Categories Dashboard</h1>

			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search category by name or ID"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => (window.location.href = `/category/add`)}
				>
					Add Category
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

			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col" onClick={() => requestSort("id")}>
							ID {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("name")}>
							Name {getSortIcon("name")}
						</th>
						<th scope="col" onClick={() => requestSort("numberOfBooks")}>
							Number of books {getSortIcon("numberOfBooks")}
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedCategories.map((category, index) => (
						<tr key={category.id}>
							<td>{index + 1}</td>
							<td>{category.id}</td>
							<td>{category.name}</td>
							<td>{category.numberOfBooks}</td>
							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() =>
										(window.location.href = `/category/view/${category.id}`)
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

export default CategoriesDashboard;
