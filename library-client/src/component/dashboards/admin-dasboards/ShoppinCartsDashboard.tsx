import { useMemo, useState } from "react";

import type { ReservationType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";
import { MockData } from "../../data/MockData";

const ShoppinCartsDashboard = () => {
	const [search, setSearch] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: "id" | "userId" | "user" | "copyId" | "itemsCount";
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || sortConfig !== null;

	const requestSort = (key: "id" | "userId" | "user" | "copyId" | "itemsCount") => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: "id" | "userId" | "user" | "copyId" | "itemsCount") => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const getItemsCount = (shoppingCart: ReservationType) => {
		return shoppingCart.bookPhysical ? 1 : 0;
	};

	const filteredAndSortedShoppingCarts = useMemo(() => {
		let data: ReservationType[] = [...MockData.mockReservations];

		if (search.trim()) {
			const lowerSearch = search.toLowerCase();

			data = data.filter((shoppingCart) => {
				const fullName =
					`${shoppingCart.user.firstName} ${shoppingCart.user.lastName}`.toLowerCase();

				return (
					String(shoppingCart.id).includes(lowerSearch) ||
					fullName.includes(lowerSearch) ||
					String(shoppingCart.user.userId).includes(lowerSearch) ||
					String(shoppingCart.copyId).includes(lowerSearch)
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
					case "userId":
						aVal = a.user.userId;
						bVal = b.user.userId;
						break;
					case "user":
						aVal = `${a.user.firstName} ${a.user.lastName}`;
						bVal = `${b.user.firstName} ${b.user.lastName}`;
						break;
					case "copyId":
						aVal = a.copyId;
						bVal = b.copyId;
						break;
					case "itemsCount":
						aVal = getItemsCount(a);
						bVal = getItemsCount(b);
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
					Add Shopping Cart
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

			<table className="table table-striped table-hover shadow text-center">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col" onClick={() => requestSort("userId")}>
							User ID {getSortIcon("userId")}
						</th>
						<th scope="col" onClick={() => requestSort("user")}>
							User Name {getSortIcon("user")}
						</th>
						<th scope="col" onClick={() => requestSort("itemsCount")}>
							Number of Items in Cart {getSortIcon("itemsCount")}
						</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedShoppingCarts.map((shoppingCart, index) => (
						<tr key={shoppingCart.id}>
							<td>{index + 1}</td>
							<td>{shoppingCart.user.userId}</td>
							<td>
								{shoppingCart.user.firstName} {shoppingCart.user.lastName}
							</td>
							<td>{getItemsCount(shoppingCart)}</td>
							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() =>
										(window.location.href = `/shoppingCart/view/${shoppingCart.id}`)
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

export default ShoppinCartsDashboard;
