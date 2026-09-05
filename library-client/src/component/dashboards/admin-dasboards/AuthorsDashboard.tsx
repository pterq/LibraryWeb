import { useMemo, useState, useEffect } from "react";
import type { AuthorType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import DeleteButton from "../admin-components/DeleteButton";
import TableAlert from "../../common/TableAlert";

import apiAuthors from "../../../api/apiAuthors";

// Importy CRUD
import ViewAuthor from "../CRUDs/Author/ViewAuthor";
import EditAuthor from "../CRUDs/Author/EditAuthor";
import AddAuthor from "../CRUDs/Author/AddAuthor";

type CrudState =
	| { mode: "dashboard" }
	| { mode: "view"; id: number }
	| { mode: "edit"; id: number }
	| { mode: "add" };

const AuthorsDashboard = () => {
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | "A_M" | "N_Z">("ALL");

	const [crud, setCrud] = useState<CrudState>({ mode: "dashboard" });
	const [authors, setAuthors] = useState<AuthorType[]>([]);
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"success" | "danger">("success");

	useEffect(() => {
		reloadAuthors();
	}, []);

	const reloadAuthors = () => {
		apiAuthors
			.getAuthors()
			.then((data) => {
				setAuthors(data);
				console.log("Fetched authors:", data);
			})
			.catch(console.error);
	};

	const showMessage = (text: string, type: "success" | "danger" = "success") => {
		setMessage(text);
		setMessageType(type);
		setTimeout(() => setMessage(null), 3000);
	};

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

	const handleDelete = async (id: number) => {
		const authorToDelete = authors.find((author) => author.id === id);
		const displayName = authorToDelete
			? `${authorToDelete.firstName} ${authorToDelete.lastName}`.trim()
			: "Unknown author";

		try {
			await apiAuthors.deleteAuthorById(id);
			showMessage(`Author "${displayName}" has been deleted.`);
			reloadAuthors();
		} catch (error) {
			if ((error as { response?: { status?: number } })?.response?.status === 409) {
				showMessage(
					`Failed to delete author "${displayName}": it is still assigned to books.`,
					"danger",
				);
				return;
			}

			showMessage(`Failed to delete author "${displayName}".`, "danger");
			console.error(error);
		}
	};

	// -----------------------------
	// RENDER CRUD
	// -----------------------------
	if (crud.mode === "view") {
		return (
			<ViewAuthor
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadAuthors}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "edit") {
		return (
			<EditAuthor
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadAuthors}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "add") {
		return (
			<AddAuthor
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadAuthors}
				showMessage={showMessage}
			/>
		);
	}

	// -----------------------------
	// RENDER DASHBOARD
	// -----------------------------
	return (
		<div className="container-fluid">
			<h1>Authors Dashboard</h1>

			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search author by name or biography"
			/>

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
						<th scope="col" onClick={() => requestSort("lastName")}>
							Last Name {getSortIcon("lastName")}
						</th>
						<th scope="col" onClick={() => requestSort("biography")}>
							Biography {getSortIcon("biography")}
						</th>
						<th scope="col" style={{ width: "160px" }}>
							Actions
						</th>
					</tr>
				</thead>

				<tbody>
					{filteredAndSortedAuthors.map((author, index) => (
						<tr key={author.id}>
							<td>{index + 1}</td>
							<td>{author.id}</td>
							<td>{author.firstName}</td>
							<td>{author.lastName}</td>
							<td>{author.biography?.substring(0, 100) || "-"}</td>

							<td className="text-nowrap">
								<button
									className="btn btn-sm btn-primary me-2"
									onClick={() => setCrud({ mode: "view", id: author.id })}
								>
									View
								</button>

								<button
									className="btn btn-sm btn-warning me-2"
									onClick={() => setCrud({ mode: "edit", id: author.id })}
								>
									Edit
								</button>

								<DeleteButton
									id={author.id}
									name={`${author.firstName} ${author.lastName}`}
									entityName="author"
									onDelete={() => handleDelete(author.id)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<TableAlert count={filteredAndSortedAuthors.length} message="No authors found." />
		</div>
	);
};

export default AuthorsDashboard;
