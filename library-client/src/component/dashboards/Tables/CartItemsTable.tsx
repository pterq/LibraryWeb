import { useEffect, useMemo, useState } from "react";

import type { CartItemResponse } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import apiCarts from "../../../api/apiCarts";
import TableAlert from "../../common/TableAlert";

// Importy CRUD
import ViewCartItem from "../CRUDs/CartItems/ViewCartItem";
import EditCartItem from "../CRUDs/CartItems/EditCartItem";
import AddCartItem from "../CRUDs/CartItems/AddCartItem";
import ViewAuthor from "../CRUDs/Author/ViewAuthor";
import DeleteButton from "../admin-components/DeleteButton";

type CrudState =
	| { mode: "dashboard" }
	| { mode: "view"; id: number }
	| { mode: "edit"; id: number }
	| { mode: "add" };

const getReservationCopy = (reservation: CartItemResponse) =>
	reservation.bookPhysical ?? reservation.copy;

const formatReservationDate = (value: Date | string) => new Date(value).toLocaleString();

const CartItemsTable = () => {
	//{ userId = null }: { userId?: number | null }
	//const selectedUserId = userId ?? null;

	const [crud, setCrud] = useState<CrudState>({ mode: "dashboard" });
	const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"success" | "danger">("success");

	useEffect(() => {
		reloadCartItems();
	}, []);

	const reloadCartItems = () => {
		apiCarts
			.getAllCartItems()
			.then((data: CartItemResponse[]) => {
				setCartItems(data);
				console.log("Fetched Cart Items:", data);
			})
			.catch(console.error);
	};

	// useEffect(() => {
	// 	apiCarts
	// 		.getAllCarts()
	// 		.then((data) => {
	// 			setCartItems(data);
	// 			console.log("Fetched Cart Items:", data);
	// 		})
	// 		.catch(console.error);
	// }, []);

	const showMessage = (text: string, type: "success" | "danger" = "success") => {
		setMessage(text);
		setMessageType(type);
		setTimeout(() => setMessage(null), 3000);
	};

	//=====================================================
	const [search, setSearch] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof CartItemResponse;
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: keyof CartItemResponse) => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof CartItemResponse) => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const cartItemsData = useMemo(() => {
		let data: CartItemResponse[] = [...cartItems];

		/*
		if (selectedUserId !== null && selectedUserId !== undefined) {
			data = data.filter((reservation) => reservation.user.id === selectedUserId);
		}
		*/

		if (search) {
			const lowerSearch = search.toLowerCase();

			data = data.filter((shoppingCart) => {
				const bookCopy = getReservationCopy(shoppingCart);
				if (!bookCopy) {
					return false;
				}

				const fullName =
					`${shoppingCart.user.firstName} ${shoppingCart.user.lastName}`.toLowerCase();
				const authors = (bookCopy.book.authors ?? [])
					.map((author) => `${author.firstName} ${author.lastName}`)
					.join(", ")
					.toLowerCase();

				return (
					String(shoppingCart.id).includes(lowerSearch) ||
					fullName.includes(lowerSearch) ||
					String(shoppingCart.user.id).includes(lowerSearch) ||
					String(bookCopy.copyId).includes(lowerSearch) ||
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
						aVal = aCopy?.copyId ?? "";
						bVal = bCopy?.copyId ?? "";
						break;
					}
					case "bookPhysical":
						aVal = getReservationCopy(a)?.book.title ?? "";
						bVal = getReservationCopy(b)?.book.title ?? "";
						break;
					case "bookPhysical":
						aVal =
							getReservationCopy(a)
								?.book.authors?.map(
									(author) => `${author.firstName} ${author.lastName}`,
								)
								.join(", ") ?? "";
						bVal =
							getReservationCopy(b)
								?.book.authors?.map(
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
	}, [cartItems, search, sortConfig]);

	if (crud.mode === "view") {
		return (
			<ViewCartItem
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadCartItems}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "edit") {
		return (
			<EditCartItem
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadCartItems}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "add") {
		return (
			<AddCartItem
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadCartItems}
				showMessage={showMessage}
			/>
		);
	}

	const handleDelete = async (id: number) => {
		const cartItemToDelete = cartItems.find((cartItem) => cartItem.id === id);
		const displayName = cartItemToDelete
			? `(${cartItemToDelete.user.id}) ${cartItemToDelete.user.firstName} ${cartItemToDelete.user.lastName}`.trim()
			: "Unknown cart item";

		try {
			await apiCarts.deleteCartById(id);
			showMessage(`Cart item "${displayName}" has been deleted.`);
			reloadCartItems();
		} catch (error) {
			if ((error as { response?: { status?: number } })?.response?.status === 409) {
				showMessage(
					`Failed to delete cart item "${displayName}": it is still assigned to orders.`,
					"danger",
				);
				return;
			}

			showMessage(`Failed to delete cart item "${displayName}".`, "danger");
			console.error(error);
		}
	};

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
					onClick={() => setCrud({ mode: "add" })}
				>
					Add Cart Item
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
			<table className="table table-striped table-hover shadow">
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
					{cartItems.map((cartItem, index) => (
						<tr key={cartItem.id}>
							<td>
								{sortConfig?.key === "id" && sortConfig?.direction === "desc"
									? cartItems.length - index
									: index + 1}
							</td>
							{/*<td>{cartItem.id}</td>*/}
							<td>
								({cartItem.user.id}) {cartItem.user.firstName}{" "}
								{cartItem.user.lastName}
							</td>
							<td>
								({getReservationCopy(cartItem)?.copyId ?? "-"}){" "}
								{getReservationCopy(cartItem)?.book.title ?? "-"}
							</td>

							<td>
								({getReservationCopy(cartItem)?.copyId ?? "-"}){" "}
								{getReservationCopy(cartItem)?.inventoryCode ?? "-"}
							</td>
							<td>{formatReservationDate(cartItem.reservedAt)}</td>
							<td>{formatReservationDate(cartItem.expiresAt)}</td>

							<td className="text-nowrap">
								<button
									className="btn btn-sm btn-primary me-2"
									onClick={() => setCrud({ mode: "view", id: cartItem.id })}
								>
									View
								</button>

								<button
									className="btn btn-sm btn-warning me-2"
									onClick={() => setCrud({ mode: "edit", id: cartItem.id })}
								>
									Edit
								</button>

								<DeleteButton
									id={cartItem.id}
									name={`(${cartItem.user.id}) ${cartItem.user.firstName} ${cartItem.user.lastName}`}
									entityName="cart item"
									onDelete={() => handleDelete(cartItem.id)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<TableAlert count={cartItems.length} message="No items found." />
		</>
	);
};

export default CartItemsTable;
