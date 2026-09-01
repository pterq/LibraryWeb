import React, { useEffect, useState } from "react";

import axiosClient from "../../../api/axiosClient";
import type { ReservationType } from "../../../types/DbTypes";

type PageAction = "view" | "add";

type CartFormData = {
	userId: string;
	copyId: string;
	reservedAt: string;
	expiresAt: string;
};

const EMPTY_FORM: CartFormData = {
	userId: "",
	copyId: "",
	reservedAt: "",
	expiresAt: "",
};

const formatDateTimeLocal = (value: Date | string | null | undefined) => {
	if (!value) {
		return "";
	}

	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	const timezoneOffset = date.getTimezoneOffset();
	const localDate = new Date(date.getTime() - timezoneOffset * 60000);
	return localDate.toISOString().slice(0, 16);
};

const ViewEditAddCartItemPage = () => {
	const path = window.location.pathname;
	const action: PageAction = path.includes("/view") ? "view" : "add";
	const queryParams = new URLSearchParams(window.location.search);
	const isEditModeFromQuery = queryParams.get("mode") === "edit";

	const rawId = path.split("/").pop() ?? "";
	const parsedReservationId = Number(rawId);
	const reservationId = Number.isFinite(parsedReservationId) ? parsedReservationId : null;

	const [isEditing, setIsEditing] = useState(action === "add" || isEditModeFromQuery);
	const isReadOnly = action === "view" && !isEditing;
	const isExistingReservationAction = action === "view";

	const [formData, setFormData] = useState<CartFormData>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isExistingReservationAction) {
			setFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(isEditModeFromQuery);

		if (!reservationId) {
			setError("Invalid or missing reservation id in URL.");
			setFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadReservation = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/reservations/${reservationId}`);
				const reservation = response.data as {
					user?: { userId?: number | string | null; id?: number | string | null } | null;
					copy?: { id?: number | string | null } | null;
					copyId?: number | string | null;
					bookPhysical?: { id?: number | string | null } | null;
					reservedAt?: ReservationType["reservedAt"] | null;
					expiresAt?: ReservationType["expiresAt"] | null;
				};

				if (!isActive) {
					return;
				}

				const resolvedCopyId =
					typeof reservation.copy?.id === "number" ||
					typeof reservation.copy?.id === "string"
						? reservation.copy.id
						: typeof reservation.copyId === "number" ||
							  typeof reservation.copyId === "string"
							? reservation.copyId
							: typeof reservation.bookPhysical?.id === "number" ||
								  typeof reservation.bookPhysical?.id === "string"
								? reservation.bookPhysical.id
								: null;

				setFormData({
					userId:
						typeof reservation.user?.userId === "number" ||
						typeof reservation.user?.userId === "string"
							? String(reservation.user.userId)
							: typeof reservation.user?.id === "number" ||
								  typeof reservation.user?.id === "string"
								? String(reservation.user.id)
								: "",
					copyId: resolvedCopyId !== null ? String(resolvedCopyId) : "",
					reservedAt: formatDateTimeLocal(reservation.reservedAt),
					expiresAt: formatDateTimeLocal(reservation.expiresAt),
				});
			} catch {
				if (!isActive) {
					return;
				}

				setError("Failed to load reservation data.");
				setFormData(EMPTY_FORM);
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		void loadReservation();

		return () => {
			isActive = false;
		};
	}, [action, isEditModeFromQuery, isExistingReservationAction, reservationId]);

	const pageTitle =
		action === "view"
			? isEditing
				? "Edit Item in Shopping Cart"
				: "View Item in Shopping Cart"
			: "Add Item to Shopping Cart";

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (isReadOnly) {
			return;
		}

		console.log("Form submit payload:", {
			user: { userId: Number(formData.userId) },
			copy: { id: Number(formData.copyId) },
			reservedAt: formData.reservedAt ? new Date(formData.reservedAt).toISOString() : null,
			expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
		});
	};

	return (
		<div className="container py-3">
			<div className="d-flex flex-wrap gap-2 mb-3">
				<button className="btn btn-secondary" onClick={() => window.history.back()}>
					Back
				</button>
				{action === "view" && !isEditing && (
					<button className="btn btn-primary" onClick={() => setIsEditing(true)}>
						Edit
					</button>
				)}
			</div>
			<h2>{pageTitle}</h2>

			{isLoading && <p>Loading reservation data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
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

				<div className="mb-3">
					<label htmlFor="copyId" className="form-label">
						Book Copy Id
					</label>
					<input
						type="number"
						id="copyId"
						name="copyId"
						className="form-control"
						value={formData.copyId}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						min="1"
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="reservedAt" className="form-label">
						Reserved At
					</label>
					<input
						type="datetime-local"
						id="reservedAt"
						name="reservedAt"
						className="form-control"
						value={formData.reservedAt}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="expiresAt" className="form-label">
						Expires At
					</label>
					<input
						type="datetime-local"
						id="expiresAt"
						name="expiresAt"
						className="form-control"
						value={formData.expiresAt}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
					/>
				</div>

				{!isReadOnly && (
					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						{action === "view" ? "Save Changes" : "Create Shopping Cart Item"}
					</button>
				)}
			</form>
		</div>
	);
};

export default ViewEditAddCartItemPage;
