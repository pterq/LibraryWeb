import { useEffect, useMemo, useState } from "react";

import type { LoanCountType, ReservationCountType, ReservationType } from "../../../types/DbTypes";

import SearchBar from "../../common/SearchBar";

import { getReservationsWithCounts } from "../../../api/api";
import TableAlert from "../../common/TableAlert";

const ShoppinCartsDashboard = () => {
	const [shoppingCartsWithCount, setShoppingCartsWithCount] = useState<ReservationCountType[]>(
		[],
	);

	useEffect(() => {
		getReservationsWithCounts()
			.then((data) => {
				setShoppingCartsWithCount(data);
				console.log("Fetched shopping carts with count:", data);
			})
			.catch(console.error);
	}, []);

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

	const getItemsCount = (shoppingCart: ReservationCountType) => {
		return shoppingCart.countReservations;
	};

	const filteredAndSortedShoppingCarts = useMemo(() => {
		let data: ReservationCountType[] = [...shoppingCartsWithCount];

		if (search.trim()) {
			const lowerSearch = search.toLowerCase();

			data = data.filter((shoppingCart) => {
				const fullName =
					`${shoppingCart.user.firstName} ${shoppingCart.user.lastName}`.toLowerCase();

				return (
					String(shoppingCart.id).includes(lowerSearch) ||
					fullName.includes(lowerSearch) ||
					String(shoppingCart.id).includes(lowerSearch) ||
					String(shoppingCart.countReservations).includes(lowerSearch)
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
						aVal = a.id;
						bVal = b.id;
						break;
					case "user":
						aVal = `${a.user.firstName} ${a.user.lastName}`;
						bVal = `${b.user.firstName} ${b.user.lastName}`;
						break;
					case "copyId":
						aVal = a.id;
						bVal = b.id;
						break;
					case "itemsCount":
						aVal = a.countReservations;
						bVal = b.countReservations;
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
	}, [shoppingCartsWithCount, search, sortConfig]);

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
					Add Users Shopping Cart
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
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>
						<th scope="col" onClick={() => requestSort("user")}>
							(ID) User{getSortIcon("user")}
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
							<td>
								{sortConfig?.key === "id" && sortConfig?.direction === "desc"
									? filteredAndSortedShoppingCarts.length - index
									: index + 1}
							</td>
							<td>
								({shoppingCart.user.id}) {shoppingCart.user.firstName}{" "}
								{shoppingCart.user.lastName}
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
			<TableAlert
				count={filteredAndSortedShoppingCarts.length}
				message="No shopping carts found."
			/>
		</div>
	);
};

export default ShoppinCartsDashboard;
