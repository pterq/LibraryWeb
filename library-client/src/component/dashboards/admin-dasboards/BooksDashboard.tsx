import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { AuthorType, BookType, CategoryType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";

import { getBooks, getCategories } from "../../../api/api";

const BooksDashboard = () => {
	const [books, setBooks] = useState<BookType[]>([]);

	useEffect(() => {
		getBooks()
			.then((data) => {
				setBooks(data);
				console.log("Fetched books:", data);
			})
			.catch(console.error);
	}, []);

	const [categories, setCategories] = useState<CategoryType[]>([]);

	useEffect(() => {
		getCategories().then(setCategories).catch(console.error);
	}, []);

	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof BookType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filterStatus !== "ALL" || sortConfig !== null;

	const requestSort = (key: keyof BookType) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof BookType) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const availableCategories = useMemo(() => {
		return [...new Set(categories.map((category) => category.name))].sort((a, b) =>
			a.localeCompare(b),
		);
	}, [categories]);

	const filteredBooks = useMemo(() => {
		let data: BookType[] = [...books];

		if (search) {
			data = data.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()));
		}

		if (filterStatus !== "ALL") {
			if (filterStatus === "NONE") {
				data = data.filter((book) => !book.categories || book.categories.length === 0);
			} else {
				data = data.filter((book) =>
					(book.categories ?? []).some((category) => category.name === filterStatus),
				);
			}
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: number | string;
				let bVal: number | string;

				switch (sortConfig.key) {
					case "id":
						aVal = a.id;
						bVal = b.id;
						break;
					case "title":
						aVal = a.title;
						bVal = b.title;
						break;
					case "categories":
						aVal = (a.categories ?? []).map((category) => category.name).join(", ");
						bVal = (b.categories ?? []).map((category) => category.name).join(", ");
						break;
					case "bookAuthors":
						aVal = (a.bookAuthors ?? [])
							.map(
								(authorsType) => authorsType.firstName + " " + authorsType.lastName,
							)
							.join(", ");

						bVal = (b.bookAuthors ?? [])
							.map(
								(authorsType) => authorsType.firstName + " " + authorsType.lastName,
							)
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
	}, [books, search, filterStatus, sortConfig]);

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
						setFilterStatus("ALL");
					}}
				>
					Clear filters
				</button>
			</div>

			{/* Books table */}
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("title")}>
							(ID) Title {getSortIcon("title")}
						</th>
						<th scope="col" onClick={() => requestSort("bookAuthors")}>
							Authors {getSortIcon("bookAuthors")}
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
									value={filterStatus}
									onChange={(e) => setFilterStatus(e.target.value)}
								>
									<option value="ALL">All</option>
									<option value="NONE">-</option>
									{availableCategories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>
						</th>
						<th scope="col" onClick={() => requestSort("bookAuthors")}>
							Authors {getSortIcon("bookAuthors")}
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredBooks.map((book, index) => (
						<tr key={book.id}>
							<td>
								{sortConfig?.key === "id" && sortConfig?.direction === "desc"
									? filteredBooks.length - index
									: index + 1}
							</td>
							<td>
								({book.id}) {book.title}
							</td>
							<td>
								{(book.bookAuthors ?? [])
									.map((author) => `${author.firstName} ${author.lastName}`)
									.join(", ") || "-"}
							</td>
							<td>{book.isbn}</td>
							<td>{book.publishedYear}</td>
							<td>
								{(book.categories ?? [])
									.map((category) => category.name)
									.join(", ") || "-"}
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
