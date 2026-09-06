import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type {
	AuthorType,
	CartItemResponse as CartItemResponse,
} from "../../../../../types/DbTypes";
import SearchBar from "../../../../common/SearchBar";
import TableAlert from "../../../../common/TableAlert";
import apiCarts from "../../../../../api/apiCarts";

type CartExtendedType = CartItemResponse & {
	title: string;
	authors: AuthorType[];
	inventoryCode: String;
};

const CartItemsTable = ({ userId }: { userId: number }) => {
	const [items, setItems] = useState<CartItemResponse[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userId) return;

		apiCarts
			.getUserCartItemsByUserId(userId)
			.then((data) => {
				setItems(data);
				setLoading(false);
				console.log("Fetched cart items:", data);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, [userId]);

	// ============================
	// Search / Sort
	// ============================

	const [search, setSearch] = useState("");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof CartExtendedType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: keyof CartExtendedType) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof CartExtendedType) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const processedItems = useMemo(() => {
		let data = [...items];

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: any;
				let bVal: any;

				switch (sortConfig.key) {
					case "title":
						aVal = a.copy.book?.title ?? "";
						bVal = b.copy.book?.title ?? "";
						break;
					case "authors":
						aVal =
							a.copy.book?.authors
								?.map((x) => `${x.firstName} ${x.lastName}`)
								.join(", ") ?? "";
						bVal =
							b.copy.book?.authors
								?.map((x) => `${x.firstName} ${x.lastName}`)
								.join(", ") ?? "";
						break;
					case "reservedAt":
						aVal = new Date(a.reservedAt).getTime();
						bVal = new Date(b.reservedAt).getTime();
						break;
					case "expiresAt":
						aVal = new Date(a.expiresAt).getTime();
						bVal = new Date(b.expiresAt).getTime();
						break;
					default:
						aVal = a[sortConfig.key as keyof CartItemResponse];
						bVal = b[sortConfig.key as keyof CartItemResponse];
				}

				if (typeof aVal === "number" && typeof bVal === "number") {
					return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
				}

				return sortConfig.direction === "asc"
					? String(aVal).localeCompare(String(bVal))
					: String(bVal).localeCompare(String(aVal));
			});
		}

		return data.filter((item) => {
			const title = item.copy.book?.title ?? "";
			return title.toLowerCase().includes(search.toLowerCase());
		});
	}, [items, sortConfig, search]);

	// ============================
	// Render
	// ============================

	if (loading) {
		return <div className="alert alert-info py-2">Loading cart items...</div>;
	}

	return (
		<div>
			<SearchBar search={search} setSearch={setSearch} placeholder="Search by title" />

			<div className="d-flex justify-content-end mb-3">
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

			<table className="table table-striped table-hover shadow">
				<thead>
					<tr>
						<th onClick={() => requestSort("id")}># {getSortIcon("id")}</th>

						<th onClick={() => requestSort("title")}>
							Book Title {getSortIcon("title")}
						</th>

						<th onClick={() => requestSort("authors")}>
							Authors {getSortIcon("authors")}
						</th>

						<th onClick={() => requestSort("inventoryCode")}>
							Inventory Code {getSortIcon("inventoryCode")}
						</th>

						<th onClick={() => requestSort("reservedAt")}>
							Reservation Date {getSortIcon("reservedAt")}
						</th>

						<th onClick={() => requestSort("expiresAt")}>
							Expiration Date {getSortIcon("expiresAt")}
						</th>

						<th>Action</th>
					</tr>
				</thead>

				<tbody>
					{processedItems.map((item, index) => {
						const book = item.copy.book;
						const title = book?.title ?? "Unknown book";
						const authors =
							book?.authors?.map((a) => `${a.firstName} ${a.lastName}`).join(", ") ??
							"Unknown author";

						return (
							<tr key={item.id}>
								<td>{index + 1}</td>
								<td>{title}</td>
								<td>{authors}</td>
								<td>{item.copy.inventoryCode}</td>
								<td>{new Date(item.reservedAt).toLocaleDateString()}</td>
								<td>{new Date(item.expiresAt).toLocaleDateString()}</td>
								<td>
									<Link to={`/cart/${item.id}`}>View</Link>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<TableAlert count={processedItems.length} message="No cart items found." />
		</div>
	);
};

export default CartItemsTable;
