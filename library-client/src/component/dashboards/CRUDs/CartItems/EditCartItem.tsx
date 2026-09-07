import { useEffect, useState } from "react";
import apiCarts from "../../../../api/apiCarts";
import type { CartItemForm, CartItemResponse } from "../../../../types/DbTypes";

type Props = {
	id: number;
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

const EditCartItem = ({ id, onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState<CartItemForm>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<CartItemForm>(EMPTY_FORM);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const item: CartItemResponse = await apiCarts.getCartItemsByUserId(id);
				if (!active) return;

				const next: CartItemForm = {
					userId: item.user.id,
					copyId: item.copy.copyId,
					reservedAt: item.reservedAt.toISOString().slice(0, 16),
					expiresAt: item.expiresAt.toISOString().slice(0, 16),
				};

				setFormData(next);
				setOriginalFormData(next);
			} catch {
				if (active) setError("Failed to load cart item data.");
			} finally {
				if (active) setIsLoading(false);
			}
		};

		load();
		return () => {
			active = false;
		};
	}, [id]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			await apiCarts.updateCartItemByCartItemId(id, formData);

			onReload();
			showMessage("Cart item has been updated.");
			onBack();
		} catch (error) {
			const message =
				(error as { response?: { data?: { message?: string } } })?.response?.data
					?.message ?? "Failed to save changes.";

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

			<h2>Edit Cart Item</h2>

			{isLoading && <p>Loading...</p>}
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
					Save Changes
				</button>
			</form>
		</div>
	);
};

export default EditCartItem;
