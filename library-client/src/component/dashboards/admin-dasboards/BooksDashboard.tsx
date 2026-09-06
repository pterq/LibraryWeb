import { useEffect, useMemo, useState } from "react";
import type { BookType, CategoryType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import DeleteButton from "../admin-components/DeleteButton";
import TableAlert from "../../common/TableAlert";

import apiBooks from "../../../api/apiBooks";
import apiCategories from "../../../api/apiCategories";

import ViewBook from "../CRUDs/Book/ViewBook";
import EditBook from "../CRUDs/Book/EditBook";
import AddBook from "../CRUDs/Book/AddBook";

type CrudState =
	| { mode: "dashboard" }
	| { mode: "view"; id: number }
	| { mode: "edit"; id: number }
	| { mode: "add" };

const getCategoryNames = (book: BookType): string[] => {
	const legacyCategory = (book as BookType & { category?: { name?: string } | null }).category;

	const namesFromList = (book.categories ?? [])
		.map((category) => category?.name ?? "")
		.filter(Boolean);

	if (namesFromList.length > 0) return namesFromList;

	if (legacyCategory?.name) {
		return [legacyCategory.name];
	}

	return [];
};

const BooksDashboard = () => {
	const [crud, setCrud] = useState<CrudState>({ mode: "dashboard" });
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"success" | "danger">("success");

	const [books, setBooks] = useState<BookType[]>([]);

	useEffect(() => {
		reloadBooks();
	}, []);

	const reloadBooks = () => {
		apiBooks
			.getBooks()
			.then((data) => {
				setBooks(data);
				console.log("Fetched books:", data);
			})
			.catch(console.error);
	};

	const showMessage = (text: string, type: "success" | "danger" = "success") => {
		setMessage(text);
		setMessageType(type);
		setTimeout(() => setMessage(null), 3000);
	};

	const [categories, setCategories] = useState<CategoryType[]>([]);

	useEffect(() => {
		apiCategories.getCategories().then(setCategories).catch(console.error);
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
				data = data.filter((book) => getCategoryNames(book).length === 0);
			} else {
				data = data.filter((book) => getCategoryNames(book).includes(filterStatus));
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
						aVal = getCategoryNames(a).join(", ");
						bVal = getCategoryNames(b).join(", ");
						break;
					case "authors":
						aVal = a.authors.map((x) => `${x.firstName} ${x.lastName}`).join(", ");
						bVal = b.authors.map((x) => `${x.firstName} ${x.lastName}`).join(", ");
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

	const handleDelete = (id: number) => {
		const bookToDelete = books.find((book) => book.id === id);
		const displayTitle = bookToDelete?.title?.trim() || "Untitled";

		apiBooks
			.deleteBookById(id)
			.then(() => {
				setBooks((prev) => prev.filter((book) => book.id !== id));
				showMessage(`Book \"${displayTitle}\" has been deleted.`);

				console.log(`Book with id ${id} deleted`);
			})
			.catch((error) => {
				if (error.response?.status === 409) {
					console.log(error.response.data);
					showMessage(
						`Failed to delete book \"${displayTitle}\": it still has copies.`,
						"danger",
					);
					return;
				}

				showMessage(`Failed to delete book \"${displayTitle}\".`, "danger");

				console.error(error);
			});
	};

	// -----------------------------
	// RENDER CRUD
	// -----------------------------
	if (crud.mode === "view") {
		return <ViewBook bookId={crud.id} onBack={() => setCrud({ mode: "dashboard" })} />;
	}

	if (crud.mode === "edit") {
		return (
			<EditBook
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadBooks}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "add") {
		return (
			<AddBook
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadBooks}
				showMessage={showMessage}
			/>
		);
	}

	return (
		<div className="container-fluid">
			<h1>Books Dashboard</h1>

			<SearchBar search={search} setSearch={setSearch} placeholder="Search book by title" />

			{message && (
				<div
					className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
					role="alert"
				>
					{message}
				</div>
			)}

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => setCrud({ mode: "add" })}
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
			<table className="table table-striped table-hover shadow">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("title")}>
							(ID) Title {getSortIcon("title")}
						</th>
						<th scope="col" onClick={() => requestSort("authors")}>
							Authors {getSortIcon("authors")}
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
								{book.authors.length > 0
									? book.authors
											.map(
												(author) =>
													`${author.firstName} ${author.lastName}`,
											)
											.join(", ")
									: "-"}
							</td>

							<td>{book.isbn}</td>
							<td>{book.publishedYear}</td>
							<td>{getCategoryNames(book).join(", ") || "-"}</td>

							<td className="text-nowrap">
								<button
									className="btn btn-sm btn-primary me-2"
									onClick={() => setCrud({ mode: "view", id: book.id })}
								>
									View
								</button>

								<button
									className="btn btn-sm btn-warning me-2"
									onClick={() => setCrud({ mode: "edit", id: book.id })}
								>
									Edit
								</button>
								<DeleteButton
									id={book.id}
									name={`(${book.id ?? "?"}) ${book.title ?? "Unknown"}`}
									entityName="physical book"
									onDelete={() => handleDelete(book.id)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<TableAlert count={filteredBooks.length} message="No books found." />
		</div>
	);
};

export default BooksDashboard;
