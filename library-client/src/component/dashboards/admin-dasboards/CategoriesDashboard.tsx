import { useEffect, useMemo, useState } from "react";
import type { CategoriesWithCountsType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import DeleteButton from "../admin-components/DeleteButton";

import apiCategories from "../../../api/apiCategories";
import TableAlert from "../../common/TableAlert";

import ViewCategory from "../CRUDs/Categories/ViewCategory";
import EditCategory from "../CRUDs/Categories/EditCategory";
import AddCategory from "../CRUDs/Categories/AddCategory";

type CrudState =
	| { mode: "dashboard" }
	| { mode: "view"; id: number }
	| { mode: "edit"; id: number }
	| { mode: "add" };

const CategoriesDashboard = () => {
	const [crud, setCrud] = useState<CrudState>({ mode: "dashboard" });
	const [categoriesWithCount, setCategoriesWithCount] = useState<CategoriesWithCountsType[]>([]);
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"success" | "danger">("success");

	useEffect(() => {
		reloadCategories();
	}, []);

	const reloadCategories = () => {
		apiCategories
			.getCategoriesWithCounts()
			.then((data) => {
				setCategoriesWithCount(data);
				console.log("Fetched categories with counts:", data);
			})
			.catch(console.error);
	};

	const showMessage = (text: string, type: "success" | "danger" = "success") => {
		setMessage(text);
		setMessageType(type);
		setTimeout(() => setMessage(null), 3000);
	};

	const [search, setSearch] = useState("");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof CategoriesWithCountsType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: keyof CategoriesWithCountsType) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof CategoriesWithCountsType) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const handleDelete = async (id: number | string) => {
		const categoryToDelete = categoriesWithCount.find((category) => category.id === Number(id));
		const displayName = categoryToDelete?.name?.trim() || "Unnamed category";

		try {
			await apiCategories.deleteCategoryById(Number(id));
			setCategoriesWithCount((prev) => prev.filter((cat) => cat.id !== Number(id)));
			showMessage(`Category "${displayName}" has been deleted.`);
			reloadCategories();
		} catch (error) {
			if ((error as { response?: { status?: number } })?.response?.status === 409) {
				showMessage(
					`Failed to delete category "${displayName}": it is still assigned to books.`,
					"danger",
				);
				return;
			}

			showMessage(`Failed to delete category "${displayName}".`, "danger");
			console.error(error);
		}
	};

	const filteredAndSortedCategories = useMemo(() => {
		let data = [...categoriesWithCount];

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
				let aVal: number | string;
				let bVal: number | string;

				switch (sortConfig.key) {
					case "id":
						aVal = a.id;
						bVal = b.id;
						break;
					case "name":
						aVal = a.name;
						bVal = b.name;
						break;
					case "countBooks":
						aVal = a.countBooks ?? 0;
						bVal = b.countBooks ?? 0;
						break;
					default:
						aVal = a[sortConfig.key];
						bVal = b[sortConfig.key];
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
	}, [categoriesWithCount, search, sortConfig]);

	// -----------------------------
	// RENDER CRUD
	// -----------------------------
	if (crud.mode === "view") {
		return (
			<ViewCategory
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadCategories}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "edit") {
		return (
			<EditCategory
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadCategories}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "add") {
		return (
			<AddCategory
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadCategories}
				showMessage={showMessage}
			/>
		);
	}

	return (
		<div className="container-fluid">
			<h1>Categories Dashboard</h1>

			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search category by name or ID"
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
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th
							scope="col"
							onClick={() => requestSort("id")}
							style={{ maxWidth: "50px" }}
						>
							Category ID {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("name")}>
							Name {getSortIcon("name")}
						</th>
						<th scope="col" onClick={() => requestSort("countBooks")}>
							Number of books {getSortIcon("countBooks")}
						</th>
						<th scope="col" style={{ width: "160px" }}>
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedCategories.map((categoryWithCount, index) => (
						<tr key={categoryWithCount.id}>
							<td>
								{sortConfig?.key === "id" && sortConfig?.direction === "desc"
									? filteredAndSortedCategories.length - index
									: index + 1}
							</td>
							<td>{categoryWithCount.id}</td>
							<td>{categoryWithCount.name}</td>
							<td>{categoryWithCount.countBooks ?? 0}</td>

							<td className="text-nowrap">
								<button
									className="btn btn-sm btn-primary me-2"
									onClick={() =>
										setCrud({ mode: "view", id: categoryWithCount.id })
									}
								>
									View
								</button>

								<button
									className="btn btn-sm btn-warning me-2"
									onClick={() =>
										setCrud({ mode: "edit", id: categoryWithCount.id })
									}
								>
									Edit
								</button>

								<DeleteButton
									id={categoryWithCount.id}
									name={categoryWithCount.name}
									entityName="category"
									onDelete={handleDelete}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<TableAlert count={filteredAndSortedCategories.length} message="No categories found." />
		</div>
	);
};

export default CategoriesDashboard;
