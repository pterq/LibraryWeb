import { useMemo, useState } from "react";

import type { AuthorType, ReservationType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import { MockData } from "../../data/MockData";

const ShoppingCartItemsDashboard = () => {
	const [search, setSearch] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key:
			| "id"
			| "user"
			| "copyId"
			| "bookTitle"
			| "author"
			| "inventoryCode"
			| "reservedAt"
			| "expiresAt";
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (
		key:
			| "id"
			| "user"
			| "copyId"
			| "bookTitle"
			| "author"
			| "inventoryCode"
			| "reservedAt"
			| "expiresAt",
	) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (
		key:
			| "id"
			| "user"
			| "copyId"
			| "bookTitle"
			| "author"
			| "inventoryCode"
			| "reservedAt"
			| "expiresAt",
	) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const shoppingCarts = useMemo(() => {
		let data: ReservationType[] = [...MockData.mockReservations];

		if (search) {
			const lowerSearch = search.toLowerCase();

			data = data.filter((shoppingCart) => {
				const fullName =
					`${shoppingCart.user.firstName} ${shoppingCart.user.lastName}`.toLowerCase();
				const authors = shoppingCart.bookPhysical.book.authors.authors
					.map((author) => `${author.firstName} ${author.lastName}`)
					.join(", ")
					.toLowerCase();

				return (
					String(shoppingCart.id).includes(lowerSearch) ||
					fullName.includes(lowerSearch) ||
					String(shoppingCart.user.userId).includes(lowerSearch) ||
					String(shoppingCart.copyId).includes(lowerSearch) ||
					shoppingCart.bookPhysical.book.title.toLowerCase().includes(lowerSearch) ||
					authors.includes(lowerSearch) ||
					shoppingCart.bookPhysical.inventoryCode.toLowerCase().includes(lowerSearch)
				);
			});
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: string | number = "";
				let bVal: string | number = "";

				switch (sortConfig.key) {
					case "id":
						aVal = a.id;
						bVal = b.id;
						break;
					case "user":
						aVal = `${a.user.firstName} ${a.user.lastName}`;
						bVal = `${b.user.firstName} ${b.user.lastName}`;
						break;
					case "copyId":
						aVal = a.copyId;
						bVal = b.copyId;
						break;
					case "bookTitle":
						aVal = a.bookPhysical.book.title;
						bVal = b.bookPhysical.book.title;
						break;
					case "author":
						aVal = a.bookPhysical.book.authors.authors
							.map((author) => `${author.firstName} ${author.lastName}`)
							.join(", ");
						bVal = b.bookPhysical.book.authors.authors
							.map((author) => `${author.firstName} ${author.lastName}`)
							.join(", ");
						break;
					case "inventoryCode":
						aVal = a.bookPhysical.inventoryCode;
						bVal = b.bookPhysical.inventoryCode;
						break;
					case "reservedAt":
						aVal = new Date(a.reservedAt).getTime();
						bVal = new Date(b.reservedAt).getTime();
						break;
					case "expiresAt":
						aVal = new Date(a.expiresAt).getTime();
						bVal = new Date(b.expiresAt).getTime();
						break;
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
	}, [search, sortConfig]);

	return (
		<div className="container-fluid">
			<h1>Shopping Carts Dashboard</h1>

			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search reservation by user, book title, author or inventory code"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => (window.location.href = `/shoppingCart/add`)}
				>
					Add Item to Shopping Cart
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

			{/* Shopping carts table */}
			<table className="table table-striped table-hover shadow text-center">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("id")}>
							Reservation ID {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("user")}>
							User ID {getSortIcon("user")}
						</th>
						<th scope="col" onClick={() => requestSort("copyId")}>
							Copy ID {getSortIcon("copyId")}
						</th>
						<th scope="col" onClick={() => requestSort("bookTitle")}>
							Book Title {getSortIcon("bookTitle")}
						</th>
						<th scope="col" onClick={() => requestSort("author")}>
							Book Author {getSortIcon("author")}
						</th>
						<th scope="col" onClick={() => requestSort("inventoryCode")}>
							Inventory Code {getSortIcon("inventoryCode")}
						</th>
						<th scope="col" onClick={() => requestSort("reservedAt")}>
							Reserved At {getSortIcon("reservedAt")}
						</th>
						<th scope="col" onClick={() => requestSort("expiresAt")}>
							Expires At {getSortIcon("expiresAt")}
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{shoppingCarts.map((shoppingCartItem, index) => (
						<tr key={shoppingCartItem.id}>
							<td>{index + 1}</td>
							<td>{shoppingCartItem.id}</td>
							<td>
								{shoppingCartItem.user.firstName} {shoppingCartItem.user.lastName}
							</td>
							<td>{shoppingCartItem.bookPhysical.id}</td>
							<td>{shoppingCartItem.bookPhysical.book.title}</td>
							<td>
								{shoppingCartItem.bookPhysical.book.authors.authors
									.map(
										(author: AuthorType) =>
											`${author.firstName} ${author.lastName}`,
									)
									.join(", ")}
							</td>
							<td>{shoppingCartItem.bookPhysical.inventoryCode}</td>
							<td>{shoppingCartItem.reservedAt.toLocaleString()}</td>
							<td>{shoppingCartItem.expiresAt.toLocaleString()}</td>

							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() =>
										(window.location.href = `/shoppingCartItem/view/${shoppingCartItem.id}`)
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

export default ShoppingCartItemsDashboard;
