import { useState } from "react";
import apiCarts from "../../../../api/apiCarts";
import type { CartItemForm } from "../../../../types/DbTypes";

type Props = {
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string, type?: "success" | "danger") => void;
};

const EMPTY_FORM: CartItemForm = {
	userId: 0,
	copyId: 0,
	reservedAt: "",
	expiresAt: "",
};

const AddCartItem = ({ onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState<CartItemForm>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			await apiCarts.createCartItem(formData);

			onReload();
			showMessage("Cart item has been added.");
			onBack();
		} catch (error) {
			const message =
				(error as { response?: { data?: { message?: string } } })?.response?.data
					?.message ?? "Failed to create cart item.";

			setError(message);
			showMessage(message, "danger");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container py-3">
			<div className="d-flex gap-2 mb-3">
				<button className="btn btn-secondary" onClick={onBack}>
					Back
				</button>
			</div>

			<h2>Add Cart Item</h2>

			{error && <p className="text-danger">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				<div className="mb-3">
					<label className="form-label">User ID</label>
					<input
						type="number"
						name="userId"
						className="form-control"
						value={formData.userId}
						onChange={handleChange}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Copy ID</label>
					<input
						type="number"
						name="copyId"
						className="form-control"
						value={formData.copyId}
						onChange={handleChange}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Reserved At</label>
					<input
						type="datetime-local"
						name="reservedAt"
						className="form-control"
						value={formData.reservedAt}
						onChange={handleChange}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Expires At</label>
					<input
						type="datetime-local"
						name="expiresAt"
						className="form-control"
						value={formData.expiresAt}
						onChange={handleChange}
						required
						disabled={isLoading}
					/>
				</div>

				<button type="submit" className="btn btn-primary" disabled={isLoading}>
					Create Cart Item
				</button>
			</form>
		</div>
	);
};

export default AddCartItem;
