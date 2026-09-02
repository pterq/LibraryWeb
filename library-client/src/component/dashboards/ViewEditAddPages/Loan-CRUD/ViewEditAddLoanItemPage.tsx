import React, { useEffect, useState } from "react";

import axiosClient from "../../../../api/axiosClient";
import type { LoanType } from "../../../../types/DbTypes";
import ReturnButton from "../../../common/ReturnButton";
import { idFromLink } from "../../../../context/DataFromLink";

type LoanItemFormData = {
	userId: string;
	copyId: string;
	loanDate: string;
	dueDate: string;
	returnDate: string;
	status: LoanType["status"];
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

const ViewEditAddLoanItemPage = () => {
	const linkId = idFromLink;

	const [isEditing, setIsEditing] = useState(false);
	const isReadOnly = !isEditing;

	const [formData, setFormData] = useState<LoanItemFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<LoanItemFormData>(EMPTY_FORM);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!linkId) {
			setError("Invalid or missing loan id in URL.");
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
					loanDate?: string | Date | null;
					dueDate?: string | Date | null;
					returnDate?: string | Date | null;
					status?: LoanType["status"];
				};

				if (!isActive) return;

				const loaded: LoanItemFormData = {
					userId: loan.user?.userId ? String(loan.user.userId) : "",
					copyId: loan.copy?.id ? String(loan.copy.id) : "",
					loanDate: formatDateTimeLocal(loan.loanDate),
					dueDate: formatDateTimeLocal(loan.dueDate),
					returnDate: loan.returnDate ? formatDateTimeLocal(loan.returnDate) : "",
					status: loan.status ?? "BORROWED",
				};

				setFormData(loaded);
				setOriginalFormData(loaded);
			} catch {
				if (!isActive) return;
				setError("Failed to load loan data.");
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		void loadLoan();

		return () => {
			isActive = false;
		};
	}, [linkId]);

	const pageTitle = isEditing ? "Edit Loan Item" : "View Loan Item";

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
			loanDate: formData.loanDate ? new Date(formData.loanDate).toISOString() : null,
			dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
			returnDate: formData.returnDate ? new Date(formData.returnDate).toISOString() : null,
			status: formData.status,
		});
	};

	const handleCancelEdit = () => {
		setFormData(originalFormData);
		setIsEditing(false);
		setError(null);
	};

	const handleDelete = () => {
		if (!linkId) {
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

			<div className="d-flex flex-wrap gap-2 mb-3">
				<button
					type="button"
					className="btn btn-danger"
					onClick={handleDelete}
					disabled={isLoading}
				>
					Delete
				</button>

				{!isEditing && (
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

			{isLoading && <p>Loading loan data...</p>}
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
						disabled={isReadOnly || isLoading}
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
						disabled={isReadOnly || isLoading}
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
						disabled={isReadOnly || isLoading}
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
						disabled={isReadOnly || isLoading}
					>
						{LOAN_STATUSES.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</div>

				{isEditing && (
					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						Save Changes
					</button>
				)}
			</form>
		</div>
	);
};

export default ViewEditAddLoanItemPage;
