import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { BookType } from "../../types/DbTypes";

import { MockData } from "../data/MockData";
import SearchBar from "../common/SearchBar";

const BooksDashboard = () => {
	const [search, setSearch] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filterCategory !== "ALL" || sortConfig !== null;

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

	const availableCategories = useMemo(() => {
		return [...new Set(MockData.mockCategories.flatMap((cat) => cat.name))].sort((a, b) =>
			a.localeCompare(b),
		);
	}, []);

	const books = useMemo(() => {
		let data: BookType[] = [...MockData.mockBooks];

		if (search) {
			data = data.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()));
		}

		if (filterCategory !== "ALL") {
			data = data.filter((book) =>
				(book.categories ?? []).some((category) => category.name === filterCategory),
			);
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: number | string;
				let bVal: number | string;

				switch (sortConfig.key) {
					case "categories":
						aVal = (a.categories ?? []).map((category) => category.name).join(", ");
						bVal = (b.categories ?? []).map((category) => category.name).join(", ");
						break;
					case "authors":
						aVal = a.authors.authors
							.map((author) => `${author.firstName} ${author.lastName}`)
							.join(", ");
						bVal = b.authors.authors
							.map((author) => `${author.firstName} ${author.lastName}`)
							.join(", ");
						break;
					default:
						aVal = a[sortConfig.key as keyof BookType] as number | string;
						bVal = b[sortConfig.key as keyof BookType] as number | string;
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
	}, [search, filterCategory, sortConfig]);

	return (
		<div className="container-fluid">
			<h1>Books Dashboard</h1>

			<SearchBar search={search} setSearch={setSearch} placeholder="Search book by title" />

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => (window.location.href = `/book/add`)}
				>
					Add Book
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

			{/* Books table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col" onClick={() => requestSort("id")}>
							Book ID {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("title")}>
							Title {getSortIcon("title")}
						</th>
						<th scope="col" onClick={() => requestSort("isbn")}>
							ISBN {getSortIcon("isbn")}
						</th>
						<th scope="col" onClick={() => requestSort("publishedYear")}>
							Published Year {getSortIcon("publishedYear")}
						</th>
						<th scope="col" style={{ width: "18%" }}>
							<div className="d-flex align-items-center gap-2">
								<span onClick={() => requestSort("categories")}>
									Categories {getSortIcon("categories")}
								</span>
								<select
									className="form-select form-select-sm py-0"
									style={{ width: "auto" }}
									value={filterCategory}
									onChange={(e) => setFilterCategory(e.target.value)}
								>
									<option value="ALL">All</option>
									{availableCategories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>
						</th>
						<th scope="col" onClick={() => requestSort("authors")}>
							Authors {getSortIcon("authors")}
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{books.map((book, index) => (
						<tr key={book.id}>
							<td>{index + 1}</td>
							<td>{book.id}</td>
							<td>{book.title}</td>
							<td>{book.isbn}</td>
							<td>{book.publishedYear}</td>
							<td>
								{(book.categories ?? [])
									.map((category) => category.name)
									.join(", ")}
							</td>
							<td>
								{book.authors.authors
									.map((author) => `${author.firstName} ${author.lastName}`)
									.join(", ")}
							</td>
							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() => (window.location.href = `/book/view/${book.id}`)}
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

export default BooksDashboard;
