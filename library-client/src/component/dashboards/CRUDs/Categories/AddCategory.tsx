import { useState } from "react";
import apiCategories from "../../../../api/apiCategories";
import type { CategoryForm } from "../../../../types/DbTypes";

type Props = {
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string, type?: "success" | "danger") => void;
};

const EMPTY_FORM: CategoryForm = {
	name: "",
};

const AddCategory = ({ onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState<CategoryForm>(EMPTY_FORM);
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
			await apiCategories.addCategory(formData);

			onReload();
			showMessage("Category has been added.");
			onBack();
		} catch {
			setError("Failed to create category.");
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

			<h2>Add Category</h2>

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
					Create Category
				</button>
			</form>
		</div>
	);
};

export default AddCategory;
