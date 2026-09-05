import { useEffect, useMemo, useState } from "react";

import type {
	AuthorType,
	ReservationType,
	BookType,
	BookPhysicalType,
} from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import { getReservations } from "../../../api/api";
import TableAlert from "../../common/TableAlert";

const getReservationCopy = (reservation: ReservationType) =>
	reservation.bookPhysical ?? reservation.copy;

const formatReservationDate = (value: Date | string) => new Date(value).toLocaleString();

const CartItemsTable = ({ userId = null }: { userId?: number | null }) => {
	const selectedUserId = userId ?? null;
	const [reservations, setReservations] = useState<ReservationType[] | null>(null);

	useEffect(() => {
		getReservations()
			.then((data) => {
				setReservations(data);
				console.log("Fetched reservations:", data);
			})
			.catch(console.error);
	}, []);

	//=====================================================
	const [search, setSearch] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof ReservationType;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: keyof ReservationType) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof ReservationType) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const shoppingCarts = useMemo(() => {
		let data: ReservationType[] = [...(reservations ?? [])];

		if (selectedUserId !== null && selectedUserId !== undefined) {
			data = data.filter((reservation) => reservation.user.id === selectedUserId);
		}

		if (search) {
			const lowerSearch = search.toLowerCase();

			data = data.filter((shoppingCart) => {
				const bookCopy = getReservationCopy(shoppingCart);
				if (!bookCopy) {
					return false;
				}

				const fullName =
					`${shoppingCart.user.firstName} ${shoppingCart.user.lastName}`.toLowerCase();
				const authors = (bookCopy.book.bookAuthors ?? [])
					.map((author) => `${author.firstName} ${author.lastName}`)
					.join(", ")
					.toLowerCase();

				return (
					String(shoppingCart.id).includes(lowerSearch) ||
					fullName.includes(lowerSearch) ||
					String(shoppingCart.user.id).includes(lowerSearch) ||
					String(bookCopy.id).includes(lowerSearch) ||
					bookCopy.book.title.toLowerCase().includes(lowerSearch) ||
					authors.includes(lowerSearch) ||
					bookCopy.inventoryCode.toLowerCase().includes(lowerSearch)
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
					case "copy":
					case "bookPhysical": {
						const aCopy = getReservationCopy(a);
						const bCopy = getReservationCopy(b);
						aVal = aCopy?.id ?? "";
						bVal = bCopy?.id ?? "";
						break;
					}
					case "bookPhysical":
						aVal = getReservationCopy(a)?.book.title ?? "";
						bVal = getReservationCopy(b)?.book.title ?? "";
						break;
					case "bookPhysical":
						aVal =
							getReservationCopy(a)
								?.book.bookAuthors?.map(
									(author) => `${author.firstName} ${author.lastName}`,
								)
								.join(", ") ?? "";
						bVal =
							getReservationCopy(b)
								?.book.bookAuthors?.map(
									(author) => `${author.firstName} ${author.lastName}`,
								)
								.join(", ") ?? "";
						break;
					case "bookPhysical":
						aVal = getReservationCopy(a)?.inventoryCode ?? "";
						bVal = getReservationCopy(b)?.inventoryCode ?? "";
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
	}, [reservations, search, sortConfig, selectedUserId]);

	return (
		<>
			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search reservation by user, book title, author or inventory code"
			/>

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => (window.location.href = `/shoppingCartItem/add`)}
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
						{/*<th scope="col" onClick={() => requestSort("id")}>
							Reservation ID {getSortIcon("id")}
						</th>*/}

						<th scope="col" onClick={() => requestSort("user")}>
							(ID) User {getSortIcon("user")}
						</th>
						<th scope="col" onClick={() => requestSort("bookPhysical")}>
							(ID) Book Title {getSortIcon("bookPhysical")}
						</th>
						<th scope="col" onClick={() => requestSort("copy")}>
							(ID) Inventory Code {getSortIcon("copy")}
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
					{shoppingCarts.map((cartItem, index) => (
						<tr key={cartItem.id}>
							<td>
								{sortConfig?.key === "id" && sortConfig?.direction === "desc"
									? shoppingCarts.length - index
									: index + 1}
							</td>
							{/*<td>{cartItem.id}</td>*/}
							<td>
								({cartItem.user.id}) {cartItem.user.firstName}{" "}
								{cartItem.user.lastName}
							</td>
							<td>
								({getReservationCopy(cartItem)?.id ?? "-"}){" "}
								{getReservationCopy(cartItem)?.book.title ?? "-"}
							</td>

							<td>
								({getReservationCopy(cartItem)?.id ?? "-"}){" "}
								{getReservationCopy(cartItem)?.inventoryCode ?? "-"}
							</td>
							<td>{formatReservationDate(cartItem.reservedAt)}</td>
							<td>{formatReservationDate(cartItem.expiresAt)}</td>

							<td>
								<button
									className="btn btn-sm btn-primary me-2"
									onClick={() =>
										(window.location.href = `/shoppingCartItem/view/${cartItem.id}`)
									}
								>
									View Details
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<TableAlert count={shoppingCarts.length} message="No items found." />
		</>
	);
};

export default CartItemsTable;
