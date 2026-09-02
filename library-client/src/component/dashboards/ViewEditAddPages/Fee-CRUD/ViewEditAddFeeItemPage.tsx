import React, { useEffect, useState } from "react";

import axiosClient from "../../../../api/axiosClient";
import { actionFromLink, idFromLink, type PageAction } from "../../../../context/DataFromLink";
import ReturnButton from "../../../common/ReturnButton";

type FeeStatus = "PENDING" | "PAID" | "CANCELLED";

type FeeItemFormData = {
	userId: string;
	loanId: string;
	amount: string;
	createdAt: string;
	paidAt: string;
	status: FeeStatus;
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

const ViewEditAddFeeItemPage = () => {
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;

	const [formData, setFormData] = useState<FeeItemFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<FeeItemFormData>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		if (action !== "view") {
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
					status: fee.status ?? "PENDING",
				};

				setFormData(nextFormData);
				setOriginalFormData(nextFormData);
			} catch {
				if (!isActive) return;

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
	}, [action, linkId]);

	const pageTitle = action === "view" ? (isEditing ? "Edit Fee" : "View Fee") : "Add Fee";

	const areMainFieldsLocked = isReadOnly || isLoading || isSubmitting;
	const isStatusLocked = isReadOnly || isLoading || isSubmitting;

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
				status: updatedFee.status ?? "PENDING",
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
		window.history.back();
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

			{isLoading && <p>Loading fee data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}
			{successMessage && <p className="text-success mb-3">{successMessage}</p>}

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
						disabled={areMainFieldsLocked}
						min="1"
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="loanId" className="form-label">
						Loan Id
					</label>
					<input
						type="number"
						id="loanId"
						name="loanId"
						className="form-control"
						value={formData.loanId}
						onChange={handleChange}
						disabled={areMainFieldsLocked}
						min="1"
						required
					/>
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
						disabled
						readOnly
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
						disabled
						readOnly
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

				{!isReadOnly && (
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
				)}
			</form>
		</div>
	);
};

export default ViewEditAddFeeItemPage;
