import { useEffect, useMemo, useState } from "react";

import type { CartItemResponse } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import apiCarts from "../../../api/apiCarts";
import TableAlert from "../../common/TableAlert";

// Importy CRUD
import ViewCartItem from "../CRUDs/CartItems/ViewCartItem";
import EditCartItem from "../CRUDs/CartItems/EditCartItem";
import AddCartItem from "../CRUDs/CartItems/AddCartItem";
import DeleteButton from "../admin-components/DeleteButton";

type CrudState =
	| { mode: "dashboard" }
	| { mode: "view"; id: number }
	| { mode: "edit"; id: number }
	| { mode: "add" };

const formatReservationDate = (value: Date | string) => new Date(value).toLocaleString();

const CartItemsTable = () => {
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

	const showMessage = (text: string, type: "success" | "danger" = "success") => {
		setMessage(text);
		setMessageType(type);
		setTimeout(() => setMessage(null), 3000);
	};

	//=====================================================
	const formatDateTime = (value: string | Date) => {
		const date = new Date(value);
		return date.toLocaleString("pl-PL", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	//=====================================================
	const [search, setSearch] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof CartItemResponse | "bookTitle" | "inventoryCode";
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: keyof CartItemResponse | "bookTitle" | "inventoryCode") => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof CartItemResponse | "bookTitle" | "inventoryCode") => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const cartItemsData = useMemo(() => {
		let data: CartItemResponse[] = [...cartItems];

		/*
		if (selectedUserId !== null && selectedUserId !== undefined) {
			data = data.filter((reservation) => reservation.user.userId === selectedUserId);
		}
		*/

		if (search) {
			const lowerSearch = search.toLowerCase();

			data = data.filter((cartItems) => {
				if (!cartItems) {
					return false;
				}

				const fullName =
					`${cartItems.user.firstName} ${cartItems.user.lastName}`.toLowerCase();
				const authors = (cartItems.bookCopy.book.authors ?? [])
					.map((author) => `${author.firstName} ${author.lastName}`)
					.join(", ")
					.toLowerCase();

				return (
					String(cartItems.cartId).includes(lowerSearch) ||
					fullName.includes(lowerSearch) ||
					String(cartItems.user.userId).includes(lowerSearch) ||
					String(cartItems.bookCopy.copyId).includes(lowerSearch) ||
					cartItems.bookCopy.book.title.toLowerCase().includes(lowerSearch) ||
					authors.includes(lowerSearch) ||
					cartItems.bookCopy.inventoryCode.toLowerCase().includes(lowerSearch)
				);
			});
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: string | number = "";
				let bVal: string | number = "";

				switch (sortConfig.key) {
					case "cartId":
						aVal = a.cartId;
						bVal = b.cartId;
						break;

					case "user":
						aVal = `${a.user.firstName} ${a.user.lastName}`;
						bVal = `${b.user.firstName} ${b.user.lastName}`;
						break;

					case "bookTitle":
						aVal = a.bookCopy.book.title;
						bVal = b.bookCopy.book.title;
						break;

					case "inventoryCode":
						aVal = a.bookCopy.inventoryCode;
						bVal = b.bookCopy.inventoryCode;
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
		const cartItemToDelete = cartItems.find((cartItem) => cartItem.cartId === id);
		const displayName = cartItemToDelete
			? `(${cartItemToDelete.user.userId}) ${cartItemToDelete.user.firstName} ${cartItemToDelete.user.lastName}`.trim()
			: "Unknown cart item";

		try {
			await apiCarts.deleteCartItemByCartItemId(id);
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
			{/* Shopping carts table */}
			<table className="table table-striped table-hover shadow">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("cartId")}>
							# {getSortIcon("cartId")}
						</th>

						<th scope="col" onClick={() => requestSort("user")}>
							(ID) User {getSortIcon("user")}
						</th>

						<th scope="col" onClick={() => requestSort("bookTitle")}>
							(ID) Book Title {getSortIcon("bookTitle")}
						</th>

						<th scope="col" onClick={() => requestSort("inventoryCode")}>
							(ID) Inventory Code {getSortIcon("inventoryCode")}
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
					{cartItemsData.map((cartItem, index) => (
						<tr key={cartItem.cartId}>
							<td>
								{sortConfig?.key === "cartId" && sortConfig?.direction === "desc"
									? cartItemsData.length - index
									: index + 1}
							</td>

							<td>
								({cartItem.user.userId}) {cartItem.user.firstName}{" "}
								{cartItem.user.lastName}
							</td>

							<td>
								({cartItem.bookCopy.book.id}) {cartItem.bookCopy.book.title}
							</td>

							<td>
								({cartItem.bookCopy.copyId}) {cartItem.bookCopy.inventoryCode}
							</td>

							<td>{formatDateTime(cartItem.reservedAt)}</td>
							<td>{formatDateTime(cartItem.expiresAt)}</td>

							<td className="text-nowrap">
								<button
									className="btn btn-sm btn-primary me-2"
									onClick={() => setCrud({ mode: "view", id: cartItem.cartId })}
								>
									View
								</button>

								<button
									className="btn btn-sm btn-warning me-2"
									onClick={() => setCrud({ mode: "edit", id: cartItem.cartId })}
								>
									Edit
								</button>

								<DeleteButton
									id={cartItem.cartId}
									name={`(${cartItem.user.userId}) ${cartItem.user.firstName} ${cartItem.user.lastName}`}
									entityName="cart item"
									onDelete={() => handleDelete(cartItem.cartId)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<TableAlert count={cartItemsData.length} message="No items found." />
		</>
	);
};

export default CartItemsTable;
