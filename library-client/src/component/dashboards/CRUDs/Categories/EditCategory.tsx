import { useEffect, useState } from "react";
import apiCategories from "../../../../api/apiCategories";
import type { CategoryForm } from "../../../../types/DbTypes";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string, type?: "success" | "danger") => void;
};

const EMPTY_FORM: CategoryForm = {
	name: "",
};

const EditCategory = ({ id, onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState<CategoryForm>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<CategoryForm>(EMPTY_FORM);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const category = await apiCategories.getCategoryById(id);
				if (!active) return;

				const next: CategoryForm = {
					name: category.name ?? "",
				};

				setFormData(next);
				setOriginalFormData(next);
			} catch {
				if (active) setError("Failed to load category data.");
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
			await apiCategories.updateCategoryById(id, formData);

			onReload();
			showMessage("Category has been updated.");
			onBack();
		} catch {
			setError("Failed to save changes.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData(originalFormData);
		onBack();
	};

	return (
		<div className="container py-3">
			<div className="d-flex gap-2 mb-3">
				<button className="btn btn-secondary" onClick={onBack}>
					Back
				</button>

				<button className="btn btn-warning" onClick={handleCancel}>
					Cancel
				</button>
			</div>

			<h2>Edit Category</h2>

			{isLoading && <p>Loading...</p>}
			{error && <p className="text-danger">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				<div className="mb-3">
					<label className="form-label">Category Name</label>
					<input
						type="text"
						name="name"
						className="form-control"
						value={formData.name}
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

export default EditCategory;
