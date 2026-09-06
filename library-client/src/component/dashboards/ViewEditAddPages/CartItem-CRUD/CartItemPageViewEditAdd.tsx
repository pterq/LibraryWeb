import React, { useEffect, useState } from "react";

import axiosClient from "../../../../api/axiosClient";
import type { BookPhysicalResponse, CartType, UserType } from "../../../../types/DbTypes";
import { MockData } from "../../../../types/MockData";

import { actionFromLink, idFromLink, type PageAction } from "../../../../context/DataFromLink";
import ReturnButton from "../../../common/ReturnButton";
import { useAuth } from "../../../../context/AuthContext";

type CartItemFormData = {
	userId: string;
	copyId: string;
	reservedAt: string;
	expiresAt: string;
};

type UserOption = {
	id: number;
	label: string;
};

type CopyOption = {
	id: number;
	label: string;
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

const extractArrayFromResponse = <T,>(payload: unknown): T[] => {
	if (Array.isArray(payload)) return payload as T[];

	if (payload && typeof payload === "object") {
		const candidate = payload as { content?: unknown; data?: unknown; items?: unknown };

		if (Array.isArray(candidate.content)) return candidate.content as T[];
		if (Array.isArray(candidate.data)) return candidate.data as T[];
		if (Array.isArray(candidate.items)) return candidate.items as T[];
	}

	return [];
};

const getUserLabel = (user: Pick<UserType, "userId" | "firstName" | "lastName">): string => {
	const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
	return `${fullName || "Unknown user"} (ID: ${user.id})`;
};

const getCopyLabel = (
	copy: Pick<BookPhysicalResponse, "id" | "inventoryCode" | "status" | "book">,
) => {
	const bookTitle = copy.book?.title ?? "Unknown book";
	const inventoryCode = copy.inventoryCode ?? "No inventory code";
	return `Copy #${copy.copyId} - ${bookTitle} - ${inventoryCode} (${copy.status})`;
};

const loadUsersFromMockData = (): UserOption[] =>
	MockData.mockUsers.map((user) => ({
		id: Number(user.id),
		label: getUserLabel(user),
	}));

const loadCopiesFromMockData = (): CopyOption[] =>
	MockData.mockBookPhysicals.map((copy) => ({
		id: Number(copy.copyId),
		label: getCopyLabel(copy),
	}));

const CartItemPageViewEditAdd = () => {
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;
	const auth = useAuth();
	const userRole = auth.role;
	const canEditReservedAt = userRole === "ADMIN" || userRole === "LIBRARIAN";
	const canEditExpiresAt = userRole === "ADMIN";

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingReservationAction = action === "view";

	const [formData, setFormData] = useState<CartItemFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<CartItemFormData>(EMPTY_FORM);
	const [userOptions, setUserOptions] = useState<UserOption[]>([]);
	const [copyOptions, setCopyOptions] = useState<CopyOption[]>([]);
	const [usersLoading, setUsersLoading] = useState(false);
	const [copiesLoading, setCopiesLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const mockReservation =
		linkId != null
			? MockData.mockReservations.reservations.find(
					(reservation) => Number(reservation.id) === Number(linkId),
				)
			: undefined;

	useEffect(() => {
		const loadUsers = async () => {
			setUsersLoading(true);

			try {
				const response = await axiosClient.get("/user");
				const users = extractArrayFromResponse<UserType>(response.data);

				if (!users.length) {
					setUserOptions(loadUsersFromMockData());
					return;
				}

				setUserOptions(
					users.map((user) => ({
						id: Number(user.id ?? 0),
						label: getUserLabel({
							id: Number(user.id ?? 0),
							firstName: user.firstName ?? "",
							lastName: user.lastName ?? "",
						}),
					})),
				);
			} catch {
				setUserOptions(loadUsersFromMockData());
			} finally {
				setUsersLoading(false);
			}
		};

		const loadCopies = async () => {
			setCopiesLoading(true);

			try {
				const response = await axiosClient.get("/copies");
				const copies = extractArrayFromResponse<BookPhysicalResponse>(response.data);

				if (!copies.length) {
					setCopyOptions(loadCopiesFromMockData());
					return;
				}

				setCopyOptions(
					copies.map((copy) => ({
						id: Number(copy.copyId ?? 0),
						label: getCopyLabel(copy),
					})),
				);
			} catch {
				setCopyOptions(loadCopiesFromMockData());
			} finally {
				setCopiesLoading(false);
			}
		};

		void loadUsers();
		void loadCopies();
	}, []);

	useEffect(() => {
		if (!isExistingReservationAction) {
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing reservation id in URL.");
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
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
					reservedAt?: CartType["reservedAt"] | null;
					expiresAt?: CartType["expiresAt"] | null;
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

				if (mockReservation) {
					const fallbackData: CartItemFormData = {
						userId: String(mockReservation.user.id),
						copyId: String(mockReservation.copy),
						reservedAt: formatDateTimeLocal(mockReservation.reservedAt),
						expiresAt: formatDateTimeLocal(mockReservation.expiresAt),
					};

					setFormData(fallbackData);
					setOriginalFormData(fallbackData);
					setError("Loaded reservation from mock data.");
					return;
				}

				setError("Failed to load reservation data.");
				setFormData(EMPTY_FORM);
				setOriginalFormData(EMPTY_FORM);
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		void loadReservation();

		return () => {
			isActive = false;
		};
	}, [isExistingReservationAction, linkId, mockReservation]);

	const pageTitle =
		action === "view"
			? isEditing
				? "Edit Item in Shopping Cart"
				: "View Item in Shopping Cart"
			: "Add Item to Shopping Cart";

	const areMainFieldsLocked = isReadOnly || isLoading;
	const isReservedAtLocked = !isEditing || isReadOnly || isLoading || !canEditReservedAt;
	const isExpiresAtLocked = !isEditing || isReadOnly || isLoading || !canEditExpiresAt;

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
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

	return (
		<div className="container py-3">
			<ReturnButton />
			<h2>{pageTitle}</h2>

			{isLoading && <p>Loading reservation data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}
			{action === "view" && <h3>Reservation Id: {linkId}</h3>}

			<form onSubmit={handleSubmit} className="mt-3">
				<div className="row g-3 mb-3">
					<div className="col-12 col-md-6">
						<label htmlFor="userId" className="form-label">
							User
						</label>
						{usersLoading ? (
							<p className="text-muted mb-0">Loading users...</p>
						) : (
							<select
								id="userId"
								name="userId"
								className="form-select"
								value={formData.userId}
								onChange={handleChange}
								disabled={areMainFieldsLocked}
								required
							>
								<option value="">Select user</option>
								{userOptions.map((user) => (
									<option key={user.id} value={String(user.id)}>
										{user.label}
									</option>
								))}
							</select>
						)}
					</div>

					<div className="col-12 col-md-6">
						<label htmlFor="copyId" className="form-label">
							Book Copy
						</label>
						{copiesLoading ? (
							<p className="text-muted mb-0">Loading copies...</p>
						) : (
							<select
								id="copyId"
								name="copyId"
								className="form-select"
								value={formData.copyId}
								onChange={handleChange}
								disabled={areMainFieldsLocked}
								required
							>
								<option value="">Select book copy</option>
								{copyOptions.map((copy) => (
									<option key={copy.id} value={String(copy.id)}>
										{copy.label}
									</option>
								))}
							</select>
						)}
					</div>
				</div>

				{action === "view" && (
					<>
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
								disabled={isReservedAtLocked}
								readOnly={!canEditReservedAt || !isEditing}
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
								disabled={isExpiresAtLocked}
								readOnly={!canEditExpiresAt || !isEditing}
							/>
						</div>
					</>
				)}

				{action === "add" && (
					<div className="form-text">
						Reservation dates are assigned automatically during item creation.
					</div>
				)}

				{!isReadOnly && (
					<div className="d-flex gap-2 mt-3">
						<button type="submit" className="btn btn-primary" disabled={isLoading}>
							{action === "view" ? "Save Changes" : "Create Shopping Cart Item"}
						</button>
					</div>
				)}
			</form>

			<div className="d-flex flex-wrap gap-2 mt-3">
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
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => setIsEditing(true)}
						disabled={isLoading}
					>
						Edit
					</button>
				)}
				{action === "view" && isEditing && (
					<button
						type="button"
						className="btn btn-warning"
						onClick={handleCancelEdit}
						disabled={isLoading}
					>
						Cancel
					</button>
				)}
			</div>
		</div>
	);
};

export default CartItemPageViewEditAdd;
