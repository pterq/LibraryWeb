import React, { useEffect, useMemo, useState } from "react";

import axiosClient from "../../../api/axiosClient";
import type { ReservationType } from "../../../types/DbTypes";

import CartItemsTable from "../Tables/CartItemsTable";

type PageAction = "view" | "add";

type CartFormData = {
	userId: string;
};

const EMPTY_FORM: CartFormData = {
	userId: "",
};

const ViewEditAddCartPage = () => {
	const path = window.location.pathname;
	const action: PageAction = path.includes("/view") ? "view" : "add";

	const rawId = path.split("/").pop() ?? "";
	const parsedUserId = Number(rawId);
	const userIdFromPath = Number.isFinite(parsedUserId) ? parsedUserId : null;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingCartAction = action === "view";

	const [formData, setFormData] = useState<CartFormData>(EMPTY_FORM);
	const [reservations, setReservations] = useState<ReservationType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const selectedUserId = useMemo(() => {
		const numericUserId = Number(formData.userId);
		return Number.isFinite(numericUserId) && numericUserId > 0 ? numericUserId : null;
	}, [formData.userId]);

	useEffect(() => {
		if (!isExistingCartAction) {
			setFormData(EMPTY_FORM);
			setReservations([]);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!userIdFromPath) {
			setError("Invalid or missing user id in URL.");
			setFormData(EMPTY_FORM);
			setReservations([]);
			return;
		}

		let isActive = true;

		const loadUserReservations = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get("/reservations");
				const allReservations = Array.isArray(response.data)
					? (response.data as ReservationType[])
					: [];

				if (!isActive) {
					return;
				}

				const reservationsForUser = allReservations.filter((reservation) => {
					const user = reservation.user as
						| { userId?: number | string | null; id?: number | string | null }
						| undefined;

					if (typeof user?.userId === "number") {
						return user.userId === userIdFromPath;
					}

					if (typeof user?.userId === "string") {
						return Number(user.userId) === userIdFromPath;
					}

					if (typeof user?.id === "number") {
						return user.id === userIdFromPath;
					}

					if (typeof user?.id === "string") {
						return Number(user.id) === userIdFromPath;
					}

					return false;
				});

				setFormData({ userId: String(userIdFromPath) });
				setReservations(reservationsForUser);
			} catch {
				if (!isActive) {
					return;
				}

				setError("Failed to load shopping cart reservations.");
				setFormData({ userId: String(userIdFromPath) });
				setReservations([]);
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		void loadUserReservations();

		return () => {
			isActive = false;
		};
	}, [action, isExistingCartAction, userIdFromPath]);

	const pageTitle =
		action === "view"
			? isEditing
				? "Edit Shopping Cart"
				: "View Shopping Cart"
			: "Add Shopping Cart";

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (isReadOnly || !selectedUserId) {
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosClient.get("/reservations");
			const allReservations = Array.isArray(response.data)
				? (response.data as ReservationType[])
				: [];

			const reservationsForUser = allReservations.filter((reservation) => {
				const user = reservation.user as
					| { userId?: number | string | null; id?: number | string | null }
					| undefined;

				if (typeof user?.userId === "number") {
					return user.userId === selectedUserId;
				}

				if (typeof user?.userId === "string") {
					return Number(user.userId) === selectedUserId;
				}

				if (typeof user?.id === "number") {
					return user.id === selectedUserId;
				}

				if (typeof user?.id === "string") {
					return Number(user.id) === selectedUserId;
				}

				return false;
			});

			setReservations(reservationsForUser);
			setIsEditing(false);
		} catch {
			setError("Failed to load shopping cart reservations.");
			setReservations([]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container py-3">
			<div className="d-flex flex-wrap gap-2 mb-3">
				<button className="btn btn-secondary" onClick={() => window.history.back()}>
					Back
				</button>
			</div>
			<h2>{pageTitle}</h2>

			{isLoading && <p>Loading shopping cart data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3 mb-4">
				<div className="mb-3">
					<label htmlFor="userId" className="form-label">
						User Id
					</label>
					<input
						type="number"
						id="userId"
						name="userId"
						className="form-control"
						value={formData.userId}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						min="1"
						required
					/>
				</div>

				{!isReadOnly && (
					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						{action === "view" ? "Save Changes" : "Load Shopping Cart"}
					</button>
				)}
			</form>

			{selectedUserId && (
				<>
					<h4 className="mb-3">Reservations for user id: {selectedUserId}</h4>
					<CartItemsTable userId={selectedUserId} />
				</>
			)}
		</div>
	);
};

export default ViewEditAddCartPage;
