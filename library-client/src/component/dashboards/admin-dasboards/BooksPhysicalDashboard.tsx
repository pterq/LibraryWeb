import { useMemo, useState, useEffect } from "react";
import type { BookPhysicalResponse, BookPhysicalStatusType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import TableAlert from "../../common/TableAlert";
import DeleteButton from "../admin-components/DeleteButton";

import apiBooksPhysical from "../../../api/apiBooksPhysical";

// CRUD SPA Components
import ViewPhysicalBook from "../CRUDs/BookPhysical/ViewPhysicalBook";
import EditPhysicalBook from "../CRUDs/BookPhysical/EditPhysicalBook";
import AddPhysicalBook from "../CRUDs/BookPhysical/AddPhysicalBook";

type CrudState =
	| { mode: "dashboard" }
	| { mode: "view"; id: number }
	| { mode: "edit"; id: number }
	| { mode: "add" };

const BooksPhysicalDashboard = () => {
	const [crud, setCrud] = useState<CrudState>({ mode: "dashboard" });

	const [booksPhysical, setBooksPhysical] = useState<BookPhysicalResponse[]>([]);
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<"ALL" | BookPhysicalResponse["status"]>("ALL");
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		reloadBooksPhysical();
	}, []);

	const reloadBooksPhysical = () => {
		apiBooksPhysical
			.getBookCopies()
			.then((data) => {
				setBooksPhysical(data);
				console.log("Fetched Books Physical:", data);
			})
			.catch(console.error);
	};

	const showMessage = (text: string) => {
		setMessage(text);
		setTimeout(() => setMessage(null), 3000);
	};

	const [sortConfig, setSortConfig] = useState<{
		key: keyof BookPhysicalResponse;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filterStatus !== "ALL" || sortConfig !== null;

	const requestSort = (key: keyof BookPhysicalResponse) => {
		let direction: "asc" | "desc" = "asc";
		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof BookPhysicalResponse) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const statusOptions: BookPhysicalStatusType[] = ["AVAILABLE", "BORROWED", "RESERVED"];

	const physicalBooks = useMemo(() => {
		let data = [...booksPhysical];

		if (search.trim()) {
			const lower = search.toLowerCase();
			data = data.filter(
				(copy) =>
					copy.inventoryCode.toLowerCase().includes(lower) ||
					copy.book.title.toLowerCase().includes(lower),
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
					case "inventoryCode":
						aVal = a.inventoryCode;
						bVal = b.inventoryCode;
						break;
					case "book":
						aVal = a.book.title;
						bVal = b.book.title;
						break;
					default:
						aVal = a[sortConfig.key] as any;
						bVal = b[sortConfig.key] as any;
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
	}, [booksPhysical, search, filterStatus, sortConfig]);

	// -----------------------------
	// 🔥 SPA CRUD RENDER
	// -----------------------------
	if (crud.mode === "view") {
		return (
			<ViewPhysicalBook
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadBooksPhysical}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "edit") {
		return (
			<EditPhysicalBook
				bookId={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadBooksPhysical}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "add") {
		return (
			<AddPhysicalBook
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadBooksPhysical}
				showMessage={showMessage}
			/>
		);
	}

	const handleDelete = async (id: number) => {
		try {
			await apiBooksPhysical.deleteBookCopyById(id);
			showMessage("Physical book has been deleted.");
			reloadBooksPhysical();
		} catch (err) {
			console.error(err);
		}
	};

	// -----------------------------
	// 🔥 DASHBOARD
	// -----------------------------
	return (
		<div className="container-fluid">
			<h1>Physical Books Dashboard</h1>

			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search physical book by inventory code or title"
			/>

			{message && (
				<div className="alert alert-success" role="alert">
					{message}
				</div>
			)}

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => setCrud({ mode: "add" })}
				>
					Add Physical Book
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

			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("inventoryCode")}>
							# {getSortIcon("inventoryCode")}
						</th>
						<th scope="col" onClick={() => requestSort("inventoryCode")}>
							(ID) Inventory Code {getSortIcon("inventoryCode")}
						</th>
						<th scope="col" onClick={() => requestSort("book")}>
							(ID) Title (Authors) {getSortIcon("book")}
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
											e.target.value as "ALL" | BookPhysicalStatusType,
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
						<tr key={copy.copyId}>
							<td>
								{sortConfig?.key === "inventoryCode" &&
								sortConfig?.direction === "desc"
									? physicalBooks.length - index
									: index + 1}
							</td>

							<td>
								({copy.copyId}) {copy.inventoryCode}
							</td>

							<td>
								({copy.book?.id ?? "?"}) {copy.book?.title ?? "Unknown"} (
								{copy.book?.authors
									?.map((a) => `${a.firstName} ${a.lastName}`)
									.join(", ") ?? "-"}
								)
							</td>

							<td>{copy.status}</td>

							<td className="text-nowrap">
								<button
									className="btn btn-sm btn-primary me-2"
									onClick={() => setCrud({ mode: "view", id: copy.copyId })}
								>
									View
								</button>

								<button
									className="btn btn-sm btn-warning me-2"
									onClick={() => setCrud({ mode: "edit", id: copy.copyId })}
								>
									Edit
								</button>
								<DeleteButton
									id={copy.copyId}
									name={`(${copy.book?.id ?? "?"}) ${copy.book?.title ?? "Unknown"}`}
									entityName="physical book"
									onDelete={() => handleDelete(copy.copyId)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<TableAlert count={physicalBooks.length} message="No books found." />
		</div>
	);
};

export default BooksPhysicalDashboard;
