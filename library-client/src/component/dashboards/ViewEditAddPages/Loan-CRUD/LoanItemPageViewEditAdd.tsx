import React, { useEffect, useState } from "react";

import axiosClient from "../../../../api/axiosClient";
import type { BookPhysicalType, LoanType, UserType } from "../../../../types/DbTypes";
import ReturnButton from "../../../common/ReturnButton";
import { idFromLink, actionFromLink, type PageAction } from "../../../../context/DataFromLink";
import { MockData } from "../../../../types/MockData";
import { useAuth } from "../../../../context/AuthContext";

type LoanItemFormData = {
	userId: string;
	copyId: string;
	loanDate: string;
	dueDate: string;
	returnDate: string;
	status: LoanType["status"];
};

type UserOption = {
	id: number;
	label: string;
};

type CopyOption = {
	id: number;
	label: string;
};

const LOAN_STATUSES: LoanType["status"][] = ["BORROWED", "RETURNED", "OVERDUE"];

const EMPTY_FORM: LoanItemFormData = {
	userId: "",
	copyId: "",
	loanDate: "",
	dueDate: "",
	returnDate: "",
	status: "BORROWED",
};

const formatDateTimeLocal = (value: Date | string | null | undefined) => {
	if (!value) return "";
	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "";
	const timezoneOffset = date.getTimezoneOffset();
	const localDate = new Date(date.getTime() - timezoneOffset * 60000);
	return localDate.toISOString().slice(0, 16);
};

const normalizeLoanStatus = (status?: string | null): LoanType["status"] => {
	const normalized = status?.toUpperCase();

	if (normalized === "BORROWED" || normalized === "RETURNED" || normalized === "OVERDUE") {
		return normalized as LoanType["status"];
	}

	if (normalized === "ACTIVE") {
		return "BORROWED";
	}

	return "BORROWED";
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
	return `${fullName || "Unknown user"} (ID: ${user.userId})`;
};

const getCopyLabel = (copy: Pick<BookPhysicalType, "id" | "inventoryCode" | "status" | "book">) => {
	const bookTitle = copy.book?.title ?? "Unknown book";
	const inventoryCode = copy.inventoryCode ?? "No inventory code";
	return `Copy #${copy.id} - ${bookTitle} - ${inventoryCode} (${copy.status})`;
};

const loadUsersFromMockData = (): UserOption[] =>
	MockData.mockUsers.map((user) => ({
		id: Number(user.userId),
		label: getUserLabel(user),
	}));

const loadCopiesFromMockData = (): CopyOption[] =>
	MockData.mockBookPhysicals.map((copy) => ({
		id: Number(copy.id),
		label: getCopyLabel(copy),
	}));

const LoanItemPageViewEditAdd = () => {
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;
	const auth = useAuth();
	const userRole = auth.role;
	const canEditLoanDate = userRole === "ADMIN" || userRole === "LIBRARIAN";
	const canEditDueDate = userRole === "ADMIN" || userRole === "LIBRARIAN";
	const canEditReturnDate = userRole === "ADMIN";
	const canEditStatus = userRole === "ADMIN" || userRole === "LIBRARIAN";

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingLoanAction = action === "view";

	const [formData, setFormData] = useState<LoanItemFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<LoanItemFormData>(EMPTY_FORM);
	const [userOptions, setUserOptions] = useState<UserOption[]>([]);
	const [copyOptions, setCopyOptions] = useState<CopyOption[]>([]);
	const [usersLoading, setUsersLoading] = useState(false);
	const [copiesLoading, setCopiesLoading] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const mockLoan =
		linkId != null
			? MockData.mockLoans.find((loan) => Number(loan.id) === Number(linkId))
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
						id: Number(user.userId ?? 0),
						label: getUserLabel({
							userId: Number(user.userId ?? 0),
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
				const copies = extractArrayFromResponse<BookPhysicalType>(response.data);

				if (!copies.length) {
					setCopyOptions(loadCopiesFromMockData());
					return;
				}

				setCopyOptions(
					copies.map((copy) => ({
						id: Number(copy.id ?? 0),
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
		if (!isExistingLoanAction) {
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing loan id in URL.");
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadLoan = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/loans/${linkId}`);
				const loan = response.data as {
					user?: { userId?: number | string | null } | null;
					copy?: { id?: number | string | null } | null;
					bookPhysical?: { id?: number | string | null } | null;
					loanDate?: string | Date | null;
					dueDate?: string | Date | null;
					returnDate?: string | Date | null;
					status?: string | null;
				};

				if (!isActive) return;

				const loaded: LoanItemFormData = {
					userId: loan.user?.userId ? String(loan.user.userId) : "",
					copyId: loan.copy?.id
						? String(loan.copy.id)
						: loan.bookPhysical?.id
							? String(loan.bookPhysical.id)
							: "",
					loanDate: formatDateTimeLocal(loan.loanDate),
					dueDate: formatDateTimeLocal(loan.dueDate),
					returnDate: loan.returnDate ? formatDateTimeLocal(loan.returnDate) : "",
					status: normalizeLoanStatus(loan.status),
				};

				setFormData(loaded);
				setOriginalFormData(loaded);
			} catch {
				if (!isActive) return;

				if (mockLoan) {
					const fallbackData: LoanItemFormData = {
						userId: String(mockLoan.user.userId),
						copyId: String(mockLoan.bookPhysical.id),
						loanDate: formatDateTimeLocal(mockLoan.loanDate),
						dueDate: formatDateTimeLocal(mockLoan.dueDate),
						returnDate: formatDateTimeLocal(mockLoan.returnDate),
						status: normalizeLoanStatus(mockLoan.status),
					};

					setFormData(fallbackData);
					setOriginalFormData(fallbackData);
					setError("Loaded loan from mock data.");
					return;
				}

				setError("Failed to load loan data.");
				setFormData(EMPTY_FORM);
				setOriginalFormData(EMPTY_FORM);
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		void loadLoan();

		return () => {
			isActive = false;
		};
	}, [isExistingLoanAction, linkId, mockLoan]);

	const pageTitle =
		action === "view" ? (isEditing ? "Edit Loan Item" : "View Loan Item") : "Add Loan Item";
	const areMainFieldsLocked = isReadOnly || isLoading;
	const isLoanDateLocked = !isEditing || isReadOnly || isLoading || !canEditLoanDate;
	const isDueDateLocked = !isEditing || isReadOnly || isLoading || !canEditDueDate;
	const isReturnDateLocked = !isEditing || isReadOnly || isLoading || !canEditReturnDate;
	const isStatusLocked = !isEditing || isReadOnly || isLoading || !canEditStatus;

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
			...(action === "view"
				? {
						loanDate: formData.loanDate
							? new Date(formData.loanDate).toISOString()
							: null,
						dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
						returnDate: formData.returnDate
							? new Date(formData.returnDate).toISOString()
							: null,
						status: formData.status,
					}
				: {}),
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

			{isLoading && <p>Loading loan data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}

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
							<label htmlFor="loanDate" className="form-label">
								Loan Date
							</label>
							<input
								type="datetime-local"
								id="loanDate"
								name="loanDate"
								className="form-control"
								value={formData.loanDate}
								onChange={handleChange}
								disabled={isLoanDateLocked}
								readOnly={!canEditLoanDate || !isEditing}
								required
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="dueDate" className="form-label">
								Due Date
							</label>
							<input
								type="datetime-local"
								id="dueDate"
								name="dueDate"
								className="form-control"
								value={formData.dueDate}
								onChange={handleChange}
								disabled={isDueDateLocked}
								readOnly={!canEditDueDate || !isEditing}
								required
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="returnDate" className="form-label">
								Return Date
							</label>
							<input
								type="datetime-local"
								id="returnDate"
								name="returnDate"
								className="form-control"
								value={formData.returnDate}
								onChange={handleChange}
								disabled={isReturnDateLocked}
								readOnly={!canEditReturnDate || !isEditing}
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
								{LOAN_STATUSES.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
					</>
				)}

				{action === "add" && (
					<div className="form-text">
						Loan dates and status are assigned automatically during loan creation.
					</div>
				)}

				{isEditing && (
					<div className="d-flex gap-2 mt-3">
						<button type="submit" className="btn btn-primary" disabled={isLoading}>
							{action === "view" ? "Save Changes" : "Create Loan Item"}
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

export default LoanItemPageViewEditAdd;
