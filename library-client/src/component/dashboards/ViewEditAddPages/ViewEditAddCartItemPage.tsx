import React, { useEffect, useState } from "react";

import axiosClient from "../../../api/axiosClient";
import type { ReservationType } from "../../../types/DbTypes";

import { actionFromLink, idFromLink, type PageAction } from "../../../context/DataFromLink";
import ReturnButton from "../../common/ReturnButton";

type CartItemFormData = {
	userId: string;
	copyId: string;
	reservedAt: string;
	expiresAt: string;
};

const EMPTY_FORM: CartItemFormData = {
	userId: "",
	copyId: "",
	reservedAt: "",
	expiresAt: "",
};

const formatDateTimeLocal = (value: Date | string | null | undefined) => {
	if (!value) return "";

	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "";

	const timezoneOffset = date.getTimezoneOffset();
	const localDate = new Date(date.getTime() - timezoneOffset * 60000);
	return localDate.toISOString().slice(0, 16);
};

const ViewEditAddCartItemPage = () => {
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;

	// EDIT MODE TYLKO LOKALNY – NIE ZALEŻY OD ACTION
	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingReservationAction = action === "view";

	const [formData, setFormData] = useState<CartItemFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<CartItemFormData>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isExistingReservationAction) {
			setFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		if (!linkId) {
			setError("Invalid or missing reservation id in URL.");
			setFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadReservation = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/reservations/${linkId}`);
				const reservation = response.data as {
					user?: { userId?: number | string | null; id?: number | string | null } | null;
					copy?: { id?: number | string | null } | null;
					copyId?: number | string | null;
					bookPhysical?: { id?: number | string | null } | null;
					reservedAt?: ReservationType["reservedAt"] | null;
					expiresAt?: ReservationType["expiresAt"] | null;
				};

				if (!isActive) return;

				const resolvedCopyId =
					reservation.copy?.id ??
					reservation.copyId ??
					reservation.bookPhysical?.id ??
					null;

				const loadedData: CartItemFormData = {
					userId:
						reservation.user?.userId?.toString() ??
						reservation.user?.id?.toString() ??
						"",
					copyId: resolvedCopyId !== null ? String(resolvedCopyId) : "",
					reservedAt: formatDateTimeLocal(reservation.reservedAt),
					expiresAt: formatDateTimeLocal(reservation.expiresAt),
				};

				setFormData(loadedData);
				setOriginalFormData(loadedData);
			} catch {
				if (!isActive) return;

				setError("Failed to load reservation data.");
				setFormData(EMPTY_FORM);
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		void loadReservation();

		return () => {
			isActive = false;
		};
	}, [action, isExistingReservationAction, linkId]);

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
		if (isReadOnly) return;

		console.log("Form submit payload:", {
			user: { userId: Number(formData.userId) },
			copy: { id: Number(formData.copyId) },
			reservedAt: formData.reservedAt ? new Date(formData.reservedAt).toISOString() : null,
			expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
		});
	};

	//=============================================================

	const handleCancelEdit = () => {
		if (action === "view") {
			setFormData(originalFormData);
			setIsEditing(false);
			setError(null);
			return;
		}

		setFormData(EMPTY_FORM);
		setOriginalFormData(EMPTY_FORM);
		setError(null);
		window.history.back();
	};

	//=============================================================

	const handleDelete = () => {
		if (action !== "view" || !linkId) {
			setError("Cannot delete item: invalid item id.");
			return;
		}

		const shouldDelete = window.confirm("Are you sure you want to delete this item?");
		if (!shouldDelete) {
			return;
		}

		// Mock delete action - replace with API call when backend endpoint is ready.
		console.log("Mock delete item with id:", linkId);
		setError("Mock delete executed. Connect API call here.");
	};

	//=============================================================

	return (
		<div className="container py-3">
			<ReturnButton />

			<div className="d-flex flex-wrap gap-2 mb-3">
				{action === "view" && (
					<button
						type="button"
						className="btn btn-danger"
						onClick={handleDelete}
						disabled={isLoading}
					>
						Delete
					</button>
				)}

				{action === "view" && !isEditing && (
					<button className="btn btn-primary" onClick={() => setIsEditing(true)}>
						Edit
					</button>
				)}

				{isEditing && (
					<button type="button" className="btn btn-warning" onClick={handleCancelEdit}>
						Cancel
					</button>
				)}
			</div>

			<h2>{pageTitle}</h2>

			{isLoading && <p>Loading reservation data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}
			<h3>Reservation Id: {linkId}</h3>

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
