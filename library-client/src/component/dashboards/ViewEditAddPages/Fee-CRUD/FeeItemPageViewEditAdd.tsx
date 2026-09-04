import React, { useEffect, useState } from "react";

import axiosClient from "../../../../api/axiosClient";
import { actionFromLink, idFromLink, type PageAction } from "../../../../context/DataFromLink";
import { MockData } from "../../../../types/MockData";
import type { LoanType, UserType } from "../../../../types/DbTypes";
import ReturnButton from "../../../common/ReturnButton";
import { useAuth } from "../../../../context/AuthContext";

type FeeStatus = "PENDING" | "PAID" | "CANCELLED";

type FeeItemFormData = {
	userId: string;
	loanId: string;
	amount: string;
	createdAt: string;
	paidAt: string;
	status: FeeStatus;
};

type UserOption = {
	id: number;
	label: string;
};

type LoanOption = {
	id: number;
	label: string;
};

const FEE_STATUSES: FeeStatus[] = ["PENDING", "PAID", "CANCELLED"];

const EMPTY_FORM: FeeItemFormData = {
	userId: "",
	loanId: "",
	amount: "",
	createdAt: "",
	paidAt: "",
	status: "PENDING",
};

const formatDateTimeLocal = (value: Date | string | null | undefined) => {
	if (!value) return "";
	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "";
	const timezoneOffset = date.getTimezoneOffset();
	const localDate = new Date(date.getTime() - timezoneOffset * 60000);
	return localDate.toISOString().slice(0, 16);
};

const normalizeFeeStatus = (status?: string | null): FeeStatus => {
	const normalized = status?.toUpperCase();

	if (normalized === "PENDING" || normalized === "PAID" || normalized === "CANCELLED") {
		return normalized as FeeStatus;
	}

	if (normalized === "UNPAID") {
		return "PENDING";
	}

	return "PENDING";
};

const getUserLabel = (user: Pick<UserType, "userId" | "firstName" | "lastName">): string => {
	const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
	return `${fullName || "Unknown user"} (ID: ${user.id})`;
};

const getLoanLabel = (loan: LoanType): string => {
	const userName = `${loan.user.firstName} ${loan.user.lastName}`.trim();
	const bookTitle = loan.copy?.book?.title ?? "Unknown book";
	return `Loan #${loan.id} - ${userName || "Unknown user"} - ${bookTitle}`;
};

const loadUsersFromMockData = (): UserOption[] =>
	MockData.mockUsers.map((user) => ({
		id: Number(user.id),
		label: getUserLabel(user),
	}));

const loadLoansFromMockData = (): LoanOption[] =>
	MockData.mockLoans.map((loan) => ({
		id: Number(loan.id),
		label: getLoanLabel(loan),
	}));

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

const FeeItemPageViewEditAdd = () => {
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;
	const auth = useAuth();
	const userRole = auth.role;
	const canEditCreatedAt = userRole === "ADMIN" || userRole === "LIBRARIAN";
	const canEditPaidAt = userRole === "ADMIN";

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingFeeAction = action === "view";

	const [formData, setFormData] = useState<FeeItemFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<FeeItemFormData>(EMPTY_FORM);
	const [userOptions, setUserOptions] = useState<UserOption[]>([]);
	const [loanOptions, setLoanOptions] = useState<LoanOption[]>([]);
	const [usersLoading, setUsersLoading] = useState(false);
	const [loansLoading, setLoansLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const mockFee =
		linkId != null
			? MockData.mockFees.find((fee) => Number(fee.id) === Number(linkId))
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

		const loadLoans = async () => {
			setLoansLoading(true);

			try {
				const response = await axiosClient.get("/loans");
				const loans = extractArrayFromResponse<LoanType>(response.data);

				if (!loans.length) {
					setLoanOptions(loadLoansFromMockData());
					return;
				}

				setLoanOptions(
					loans.map((loan) => ({
						id: Number(loan.id ?? 0),
						label: getLoanLabel(loan),
					})),
				);
			} catch {
				setLoanOptions(loadLoansFromMockData());
			} finally {
				setLoansLoading(false);
			}
		};

		void loadUsers();
		void loadLoans();
	}, []);

	useEffect(() => {
		if (!isExistingFeeAction) {
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing fee id in URL.");
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadFee = async () => {
			setIsLoading(true);
			setError(null);
			setSuccessMessage(null);

			try {
				const response = await axiosClient.get(`/fees/${linkId}`);
				const fee = response.data;

				if (!isActive) return;

				const nextFormData: FeeItemFormData = {
					userId: fee.user?.userId?.toString() ?? "",
					loanId: fee.loan?.id?.toString() ?? "",
					amount: fee.amount?.toString() ?? "",
					createdAt: formatDateTimeLocal(fee.createdAt),
					paidAt: formatDateTimeLocal(fee.paidAt),
					status: normalizeFeeStatus(fee.status),
				};

				setFormData(nextFormData);
				setOriginalFormData(nextFormData);
			} catch {
				if (!isActive) return;

				if (mockFee) {
					const fallbackData: FeeItemFormData = {
						userId: String(mockFee.user.id),
						loanId: String(mockFee.loan.id),
						amount: String(mockFee.amount),
						createdAt: formatDateTimeLocal(mockFee.createdAt),
						paidAt: formatDateTimeLocal(mockFee.paidAt),
						status: normalizeFeeStatus(mockFee.status),
					};

					setFormData(fallbackData);
					setOriginalFormData(fallbackData);
					setError("Loaded fee from mock data.");
					return;
				}

				setError("Failed to load fee data.");
				setFormData(EMPTY_FORM);
				setOriginalFormData(EMPTY_FORM);
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		void loadFee();

		return () => {
			isActive = false;
		};
	}, [isExistingFeeAction, linkId, mockFee]);

	const pageTitle = action === "view" ? (isEditing ? "Edit Fee" : "View Fee") : "Add Fee";

	const areMainFieldsLocked = isReadOnly || isLoading || isSubmitting;
	const isStatusLocked = isReadOnly || isLoading || isSubmitting;
	const isCreatedAtLocked =
		!isEditing || isReadOnly || isLoading || isSubmitting || !canEditCreatedAt;
	const isPaidAtLocked = !isEditing || isReadOnly || isLoading || isSubmitting || !canEditPaidAt;

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (isReadOnly) return;

		setIsSubmitting(true);
		setError(null);
		setSuccessMessage(null);

		try {
			if (action === "add") {
				const response = await axiosClient.post("/fees", {
					user: { userId: Number(formData.userId) },
					loan: { id: Number(formData.loanId) },
					amount: Number(formData.amount),
				});

				const createdFee = response.data;
				if (typeof createdFee.id === "number") {
					window.location.href = `/fee/view/${createdFee.id}`;
					return;
				}

				setSuccessMessage("Fee created successfully.");
				setFormData(EMPTY_FORM);
				return;
			}

			if (!linkId) {
				setError("Invalid fee id.");
				return;
			}

			const response =
				formData.status === "PAID"
					? await axiosClient.post(`/fees/pay/${linkId}`)
					: await axiosClient.patch(`/fees/${linkId}/${formData.status}`);

			const updatedFee = response.data;

			const nextFormData: FeeItemFormData = {
				userId: updatedFee.user?.userId?.toString() ?? "",
				loanId: updatedFee.loan?.id?.toString() ?? "",
				amount: updatedFee.amount?.toString() ?? "",
				createdAt: formatDateTimeLocal(updatedFee.createdAt),
				paidAt: formatDateTimeLocal(updatedFee.paidAt),
				status: normalizeFeeStatus(updatedFee.status),
			};

			setFormData(nextFormData);
			setOriginalFormData(nextFormData);
			setIsEditing(false);
			setSuccessMessage("Fee updated successfully.");
		} catch {
			setError(action === "add" ? "Failed to create fee." : "Failed to update fee.");
		} finally {
			setIsSubmitting(false);
		}
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
	};

	const handleDelete = () => {
		if (action !== "view" || !linkId) {
			setError("Cannot delete item: invalid item id.");
			return;
		}

		const shouldDelete = window.confirm("Are you sure you want to delete this item?");
		if (!shouldDelete) return;

		console.log("Mock delete item with id:", linkId);
		setError("Mock delete executed. Connect API call here.");
	};

	return (
		<div className="container py-3">
			<ReturnButton />

			<h2>{pageTitle}</h2>

			{isLoading && <p>Loading fee data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}
			{successMessage && <p className="text-success mb-3">{successMessage}</p>}

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
						<label htmlFor="loanId" className="form-label">
							Loan Item
						</label>
						{loansLoading ? (
							<p className="text-muted mb-0">Loading loans...</p>
						) : (
							<select
								id="loanId"
								name="loanId"
								className="form-select"
								value={formData.loanId}
								onChange={handleChange}
								disabled={areMainFieldsLocked}
								required
							>
								<option value="">Select loan item</option>
								{loanOptions.map((loan) => (
									<option key={loan.id} value={String(loan.id)}>
										{loan.label}
									</option>
								))}
							</select>
						)}
					</div>
				</div>

				<div className="mb-3">
					<label htmlFor="amount" className="form-label">
						Amount
					</label>
					<input
						type="number"
						id="amount"
						name="amount"
						className="form-control"
						value={formData.amount}
						onChange={handleChange}
						disabled={areMainFieldsLocked}
						min="0"
						step="0.01"
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="createdAt" className="form-label">
						Created At
					</label>
					<input
						type="datetime-local"
						id="createdAt"
						name="createdAt"
						className="form-control"
						value={formData.createdAt}
						onChange={handleChange}
						disabled={isCreatedAtLocked}
						readOnly={!canEditCreatedAt || !isEditing}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="paidAt" className="form-label">
						Paid At
					</label>
					<input
						type="datetime-local"
						id="paidAt"
						name="paidAt"
						className="form-control"
						value={formData.paidAt}
						onChange={handleChange}
						disabled={isPaidAtLocked}
						readOnly={!canEditPaidAt || !isEditing}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="status" className="form-label">
						Status
					</label>
					<select
						id="status"
						name="status"
						className="form-select"
						value={formData.status}
						onChange={handleChange}
						disabled={isStatusLocked}
					>
						{FEE_STATUSES.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
					{action === "add" && (
						<div className="form-text">
							New fees are created with the PENDING status.
						</div>
					)}
				</div>

				{isEditing && (
					<div className="d-flex gap-2 mt-3">
						<button
							type="submit"
							className="btn btn-primary"
							disabled={isSubmitting || isLoading}
						>
							{isSubmitting
								? "Saving..."
								: action === "view"
									? "Save Changes"
									: "Create Fee"}
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

export default FeeItemPageViewEditAdd;
